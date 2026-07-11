// Cloudflare Pages Function — Azure Neural TTS Proxy
// Converts text to natural female voice audio using Azure Cognitive Speech.
// Credentials stored as env vars: AZURE_SPEECH_KEY, AZURE_SPEECH_REGION
//
// Falls back gracefully: if Azure is not configured, returns 503 so the
// client can fall back to browser TTS.

// Map BCP-47 language codes to Azure Neural FEMALE voices.
// Reference: high-quality neural female voices per language.
const VOICE_MAP = {
  "tr": "tr-TR-EmelNeural",
  "tr-TR": "tr-TR-EmelNeural",
  "en": "en-US-JennyNeural",
  "en-US": "en-US-JennyNeural",
  "en-GB": "en-GB-SoniaNeural",
  "de": "de-DE-KatjaNeural",
  "de-DE": "de-DE-KatjaNeural",
  "fr": "fr-FR-DeniseNeural",
  "fr-FR": "fr-FR-DeniseNeural",
  "es": "es-ES-ElviraNeural",
  "es-ES": "es-ES-ElviraNeural",
  "es-MX": "es-MX-DaliaNeural",
  "es-AR": "es-AR-ElenaNeural",
  "it": "it-IT-ElsaNeural",
  "it-IT": "it-IT-ElsaNeural",
  "pt-PT": "pt-PT-RaquelNeural",
  "pt-BR": "pt-BR-FranciscaNeural",
  "ru": "ru-RU-SvetlanaNeural",
  "ru-RU": "ru-RU-SvetlanaNeural",
  "uk": "uk-UA-PolinaNeural",
  "zh-CN": "zh-CN-XiaoxiaoNeural",
  "zh-TW": "zh-TW-HsiaoChenNeural",
  "ja": "ja-JP-NanamiNeural",
  "ko": "ko-KR-SunHiNeural",
  "ar": "ar-SA-ZariyahNeural",
  "ar-SA": "ar-SA-ZariyahNeural",
  "hi": "hi-IN-SwaraNeural",
  "hi-IN": "hi-IN-SwaraNeural",
  "nl": "nl-NL-ColetteNeural",
  "nl-NL": "nl-NL-ColetteNeural",
  "pl": "pl-PL-ZofiaNeural",
  "sv": "sv-SE-SofieNeural",
  "no": "nb-NO-PernilleNeural",
  "da": "da-DK-ChristelNeural",
  "fi": "fi-FI-NooraNeural",
  "el": "el-GR-AthinaNeural",
  "he": "he-IL-HilaNeural",
  "id": "id-ID-GadisNeural",
  "th": "th-TH-PremwadeeNeural",
  "vi": "vi-VN-HoaiMyNeural",
  "ro": "ro-RO-AlinaNeural",
  "hu": "hu-HU-NoemiNeural",
  "cs": "cs-CZ-VlastaNeural",
  "fa": "fa-IR-DilaraNeural",
  "ur": "ur-PK-UzmaNeural",
  "bn": "bn-IN-TanishaaNeural",
};

// Escape XML special characters for SSML safety
function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function resolveVoice(lang) {
  if (!lang) return VOICE_MAP["en-US"];
  if (VOICE_MAP[lang]) return VOICE_MAP[lang];
  // Try base language (e.g. "pt-PT" -> "pt")
  const base = lang.split("-")[0].toLowerCase();
  if (VOICE_MAP[base]) return VOICE_MAP[base];
  // Try any voice whose locale starts with base
  const match = Object.entries(VOICE_MAP).find(([k]) => k.toLowerCase().startsWith(base));
  if (match) return match[1];
  return VOICE_MAP["en-US"];
}

// ---- Abuse shield + per-IP bill-protection cap (mirrors chat.js) -------------------------
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
    if (h.endsWith(".ailvie.pages.dev")) return true;
    if (h === "localhost" || h === "127.0.0.1") return true;
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
function requestFromApp(request, env) {
  const origin = request.headers.get("Origin");
  if (origin) return isAllowedOrigin(origin, env);
  const referer = request.headers.get("Referer");
  if (referer) { try { return isAllowedOrigin(new URL(referer).origin, env); } catch (e) { return false; } }
  return request.headers.get("X-AILVIE-Client") === "web";
}
// TTS is billed per character → its own per-IP daily ceiling (separate counter from chat's).
// No-op until SYNC_KV is bound.
async function overDailyIpCap(env, ip) {
  const kv = env.SYNC_KV;
  if (!kv || !ip) return false;
  const cap = parseInt(env.TTS_RATE_LIMIT_PER_DAY || "400", 10);
  const key = `rlt:${new Date().toISOString().slice(0, 10)}:${ip}`;
  let n = 0;
  try { const v = await kv.get(key); n = v ? parseInt(v, 10) : 0; }
  catch (e) { return false; }
  if (n >= cap) return true;
  try { await kv.put(key, String(n + 1), { expirationTtl: 172800 }); } catch (e) {}
  return false;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = corsHeadersFor(request.headers.get("Origin"), env);
  const audioHeaders = { ...headers, "Content-Type": "audio/mpeg", "Cache-Control": "no-store" };
  const json = (obj, status) => new Response(JSON.stringify(obj), { status, headers });

  // Abuse shield — only the AILVIE app may use this endpoint.
  if (!requestFromApp(request, env)) return json({ error: "forbidden" }, 403);

  const key = env.AZURE_SPEECH_KEY;
  const region = env.AZURE_SPEECH_REGION;
  // If Azure not configured, tell client to fall back to browser TTS.
  if (!key || !region) return json({ error: "tts_not_configured" }, 503);

  // Per-IP daily bill-protection cap (active once SYNC_KV is bound; otherwise a no-op).
  if (await overDailyIpCap(env, request.headers.get("CF-Connecting-IP") || "")) {
    return json({ error: "rate_limited", retryable: false }, 429);
  }

  try {
    const body = await request.json();
    const text = (body.text || "").toString().slice(0, 3000); // cap length
    const lang = body.lang || "en-US";
    if (!text.trim()) return json({ error: "empty_text" }, 400);

    const voice = resolveVoice(lang);
    const locale = voice.split("-").slice(0, 2).join("-");

    // AILVIE's character: warm & caring. Azure express-as styles work on SOME voices only;
    // requesting an unsupported style makes Azure reject the whole request, so keep an allow-list.
    const WARM_STYLE = {
      "en-US-JennyNeural": "friendly",
      "en-US-AriaNeural": "empathetic",
      "en-US-SaraNeural": "gentle",
      "es-ES-ElviraNeural": "friendly",
      "es-MX-DaliaNeural": "friendly",
      "fr-FR-DeniseNeural": "friendly",
      "de-DE-KatjaNeural": "friendly",
      "it-IT-ElsaNeural": "friendly",
      "pt-BR-FranciscaNeural": "friendly",
      "zh-CN-XiaoxiaoNeural": "gentle",
      "ja-JP-NanamiNeural": "friendly",
      "ko-KR-SunHiNeural": "friendly",
    };
    const reqStyle = (body.style || "").toString().trim();
    const style = reqStyle || WARM_STYLE[voice] || null;

    // A touch slower/softer so it feels caring. Turkish (Emel) has no express-as style, so lean
    // a little more on prosody there to keep it soft rather than clipped.
    const isTurkish = locale === "tr-TR";
    const rate = isTurkish ? "-8%" : "-5%";
    const pitch = isTurkish ? "+1%" : "+2%";
    const inner = `<prosody rate='${rate}' pitch='${pitch}'>${escapeXml(text)}</prosody>`;
    const styled = style
      ? `<mstts:express-as style='${escapeXml(style)}' styledegree='1.4'>${inner}</mstts:express-as>`
      : inner;
    const ssml = `<speak version='1.0' xml:lang='${locale}' xmlns:mstts='https://www.w3.org/2001/mstts'>` +
      `<voice name='${voice}'>${styled}</voice></speak>`;

    const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const azureRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "AILVIE",
      },
      body: ssml,
    });

    if (!azureRes.ok) {
      const errText = await azureRes.text().catch(() => "");
      return json({ error: "azure_error", status: azureRes.status, detail: errText.slice(0, 200) }, 502);
    }

    const audio = await azureRes.arrayBuffer();
    return new Response(audio, { status: 200, headers: audioHeaders });
  } catch (e) {
    return json({ error: "proxy_exception", message: e.message }, 500);
  }
}

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeadersFor(context.request.headers.get("Origin"), context.env) });
}
// azure tts redeploy 1782416903
