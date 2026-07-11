// Cloudflare Pages Function — Anthropic API Proxy (production-hardened)
// API key is stored as env variable ANTHROPIC_API_KEY in Cloudflare Pages settings.
//
// Layers, in order of importance:
//  1) Abuse shield  — only requests coming from the AILVIE app are served. Header-less
//     (curl/scripts) and foreign-origin requests get 403. This keeps random traffic from
//     the public endpoint off your Anthropic bill. (Real per-user quotas still need auth+KV.)
//  2) Prompt caching — the large system prompt is marked cacheable, so multi-turn
//     conversations and repeated prompts read it from cache: cheaper input + lower latency.
//  3) Resilience    — transient upstream failures (429/5xx/overload/timeouts) are retried
//     server-side with backoff+jitter so the user never sees a flake.

// Origins allowed to use this endpoint. Add more via env ALLOWED_ORIGINS (comma-separated).
const PRIMARY_ORIGIN = "https://ailvie.com";
const BASE_ORIGINS = ["https://ailvie.com", "https://www.ailvie.com", "https://ailvie.pages.dev"];

function allowedList(env) {
  const extra = (env && env.ALLOWED_ORIGINS ? String(env.ALLOWED_ORIGINS).split(",").map((s) => s.trim()).filter(Boolean) : []);
  return BASE_ORIGINS.concat(extra);
}
function isAllowedOrigin(origin, env) {
  if (!origin) return false;
  if (allowedList(env).includes(origin)) return true;
  try {
    const h = new URL(origin).hostname;
    if (h.endsWith(".ailvie.pages.dev")) return true; // Cloudflare preview deploys
    if (h === "localhost" || h === "127.0.0.1") return true; // local dev
  } catch (e) {}
  return false;
}
function corsHeadersFor(origin, env) {
  const allow = isAllowedOrigin(origin, env) ? origin : PRIMARY_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allow,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-AILVIE-Client",
    "Content-Type": "application/json",
  };
}
// Is this request coming from the AILVIE app? Real browser calls carry a same-origin Origin
// (present on POST). We block anything with a foreign Origin (cross-site abuse). When BOTH
// Origin and Referer are absent — which a cross-site request can never be, since browsers
// always send Origin on cross-origin POST — we accept only if the request carries our client
// marker, so anonymous scripts/curl are still turned away without false-blocking a legit,
// privacy-hardened same-origin client that stripped its Referer.
function requestFromApp(request, env) {
  const origin = request.headers.get("Origin");
  if (origin) return isAllowedOrigin(origin, env);
  const referer = request.headers.get("Referer");
  if (referer) { try { return isAllowedOrigin(new URL(referer).origin, env); } catch (e) { return false; } }
  return request.headers.get("X-AILVIE-Client") === "web";
}

// Per-IP daily hard ceiling — a bill-protection backstop against scripted abuse. This is NOT
// the product's free-tier limit (that stays client-side and friendly); it's set high enough
// that no real user, free or PRO, ever reaches it, but low enough to stop a runaway script
// from draining the API budget. No-op until SYNC_KV is bound, so it ships safely and turns
// itself on the moment the binding exists. KV is eventually consistent, which is fine here —
// an approximate cap is all a bill guard needs.
async function overDailyIpCap(env, ip) {
  const kv = env.SYNC_KV;
  if (!kv || !ip) return false; // not bound / no IP → skip entirely
  const cap = parseInt(env.RATE_LIMIT_PER_DAY || "200", 10);
  const key = `rl:${new Date().toISOString().slice(0, 10)}:${ip}`;
  let n = 0;
  try { const v = await kv.get(key); n = v ? parseInt(v, 10) : 0; }
  catch (e) { return false; } // KV read error → never block a real user
  if (n >= cap) return true;
  try { await kv.put(key, String(n + 1), { expirationTtl: 172800 }); } catch (e) {} // ~2 days
  return false;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Which upstream statuses are worth retrying? Rate limit + server-side/overload only.
const RETRYABLE = new Set([408, 409, 429, 500, 502, 503, 504, 529]);

async function callAnthropic(apiKey, payload) {
  // Up to 3 attempts total with exponential backoff + jitter. Respect Retry-After when present.
  let lastErr = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      const backoff = Math.min(4000, 400 * Math.pow(2, attempt - 1));
      await sleep(backoff + Math.random() * 250);
    }
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30000); // hard 30s ceiling per attempt
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (resp.ok) return { ok: true, status: resp.status, data: await resp.json() };

      // Non-OK: retry if transient, otherwise return the upstream error as-is.
      if (RETRYABLE.has(resp.status) && attempt < 2) {
        const ra = parseInt(resp.headers.get("retry-after") || "0", 10);
        if (ra > 0 && ra <= 8) await sleep(ra * 1000);
        lastErr = { status: resp.status };
        continue;
      }
      let detail = null;
      try { detail = await resp.json(); } catch (e) {}
      return { ok: false, status: resp.status, data: detail };
    } catch (e) {
      // Network error / abort → retry.
      lastErr = { status: 0, message: e.name === "AbortError" ? "timeout" : e.message };
      continue;
    }
  }
  return { ok: false, status: lastErr?.status || 503, data: { error: { message: lastErr?.message || "upstream_unavailable" } } };
}

// Attach prompt caching to a large system prompt. A short prompt (below the cacheable
// minimum) is passed through untouched — caching it would do nothing and only add noise.
function withCaching(system) {
  if (!system) return undefined;
  if (typeof system === "string") {
    if (system.length > 3000) {
      return [{ type: "text", text: system, cache_control: { type: "ephemeral" } }];
    }
    return system;
  }
  return system; // already structured blocks (client may have set its own cache breakpoints)
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = corsHeadersFor(request.headers.get("Origin"), env);

  // (1) Abuse shield — reject anything not coming from the AILVIE app.
  if (!requestFromApp(request, env)) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers });
  }

  // (1b) Per-IP daily bill-protection cap (active once SYNC_KV is bound; otherwise a no-op).
  if (await overDailyIpCap(env, request.headers.get("CF-Connecting-IP") || "")) {
    return new Response(JSON.stringify({ error: "rate_limited", retryable: false }), { status: 429, headers });
  }

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "server_not_configured" }), { status: 503, headers });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "bad_request" }), { status: 400, headers });
  }

  const ALLOWED_MODELS = ["claude-sonnet-4-6", "claude-haiku-4-5-20251001", "claude-opus-4-8"];
  const requestedModel = body.model && ALLOWED_MODELS.includes(body.model) ? body.model : "claude-sonnet-4-6";

  const payload = {
    model: requestedModel,
    max_tokens: Math.min(body.max_tokens || 1000, 4000),
    messages: body.messages || [],
  };
  // (2) Prompt caching on the system prompt.
  const sys = withCaching(body.system);
  if (sys) payload.system = sys;

  // (3) Resilient upstream call (retries handled inside).
  const result = await callAnthropic(apiKey, payload);

  if (result.ok) {
    return new Response(JSON.stringify(result.data), { status: 200, headers });
  }

  // Map upstream failures to a stable, client-friendly shape. `retryable` tells the client
  // whether trying again shortly is worth it (drives the "try again" vs "give up" message).
  const retryable = RETRYABLE.has(result.status) || result.status === 0 || result.status === 503;
  return new Response(
    JSON.stringify({
      error: result.status === 429 ? "rate_limited" : retryable ? "temporarily_unavailable" : "upstream_error",
      status: result.status,
      retryable,
    }),
    { status: result.status === 429 ? 429 : retryable ? 503 : (result.status || 502), headers }
  );
}

export async function onRequestOptions(context) {
  const { request, env } = context;
  return new Response(null, { headers: corsHeadersFor(request.headers.get("Origin"), env) });
}
