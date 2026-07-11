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

export async function onRequestPost(context) {
  const { request, env } = context;
  const key = env.AZURE_SPEECH_KEY;
  const region = env.AZURE_SPEECH_REGION;

  // If Azure not configured, tell client to fall back to browser TTS
  if (!key || !region) {
    return new Response(JSON.stringify({ error: "tts_not_configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    const body = await request.json();
    const text = (body.text || "").toString().slice(0, 3000); // cap length
    const lang = body.lang || "en-US";

    if (!text.trim()) {
      return new Response(JSON.stringify({ error: "empty_text" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const voice = resolveVoice(lang);
    const locale = voice.split("-").slice(0, 2).join("-");

    // AILVIE's character: warm & caring, like a reassuring nurse.
    // Azure emotional styles (mstts:express-as) are only supported by SOME voices; requesting an
    // unsupported style makes Azure reject the whole request. Keep an allow-list and fall back to
    // plain prosody otherwise. Callers may pass an explicit style (e.g. an alarm wants a firmer tone).
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

    // A touch slower and softer than default so it feels caring, not clipped.
    // Warmer, calmer delivery. Turkish (Emel) has no emotional style, so we lean a little more on
    // prosody there to keep it soft rather than clipped.
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
      return new Response(JSON.stringify({ error: "azure_error", status: azureRes.status, detail: errText.slice(0, 200) }), {
        status: 502,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Stream the MP3 audio back to the client
    const audio = await azureRes.arrayBuffer();
    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "proxy_exception", message: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
// azure tts redeploy 1782416903
