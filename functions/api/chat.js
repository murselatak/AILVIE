// Cloudflare Pages Function — Anthropic API Proxy (production-hardened)
// API key is stored as env variable ANTHROPIC_API_KEY in Cloudflare Pages settings.
//
// Why this file is defensive: users on mobile networks hit transient failures constantly
// (rate limits, brief overloads, dropped connections). Without retries every one of those
// becomes a visible error. So we retry transient failures here, server-side, with backoff —
// the user never sees them. Only genuinely permanent errors are surfaced.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

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

export async function onRequestPost(context) {
  const { request, env } = context;

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "server_not_configured" }),
      { status: 503, headers: corsHeaders }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "bad_request" }), { status: 400, headers: corsHeaders });
  }

  const ALLOWED_MODELS = ["claude-sonnet-4-6", "claude-haiku-4-5-20251001", "claude-opus-4-8"];
  const requestedModel = body.model && ALLOWED_MODELS.includes(body.model) ? body.model : "claude-sonnet-4-6";

  const payload = {
    model: requestedModel,
    max_tokens: Math.min(body.max_tokens || 1000, 4000),
    messages: body.messages || [],
  };
  if (body.system) payload.system = body.system;

  const result = await callAnthropic(apiKey, payload);

  if (result.ok) {
    return new Response(JSON.stringify(result.data), { status: 200, headers: corsHeaders });
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
    { status: result.status === 429 ? 429 : retryable ? 503 : (result.status || 502), headers: corsHeaders }
  );
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}
