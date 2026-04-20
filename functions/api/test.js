// Health check endpoint to verify Cloudflare Pages Functions are deployed
export async function onRequest(context) {
  const { env } = context;
  return new Response(JSON.stringify({
    status: "ok",
    message: "Cloudflare Pages Functions working",
    env_var_set: env.ANTHROPIC_API_KEY ? "YES (length: " + env.ANTHROPIC_API_KEY.length + ")" : "NO — environment variable missing",
    timestamp: new Date().toISOString()
  }, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
