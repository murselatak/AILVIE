// Test endpoint — makes a real API call to diagnose what's happening
export async function onRequest(context) {
  const { env } = context;
  const apiKey = env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "No API key set" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 100,
        messages: [{ role: "user", content: "Merhaba, sen kimsin?" }]
      }),
    });
    
    const data = await response.json();
    return new Response(JSON.stringify({
      http_status: response.status,
      anthropic_response: data,
      key_prefix: apiKey.substring(0, 15) + "...",
      key_length: apiKey.length
    }, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: "Fetch failed",
      message: err.message
    }, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
