// AILVIE end-to-end encrypted sync.
//
// ZERO-KNOWLEDGE: this endpoint stores an opaque ciphertext. It has no key and
// cannot decrypt user health data. It only sees:
//   syncId    - SHA-256 derived id (not the raw email)
//   authHash  - SHA-256 of a key derived from the user's password (write permission proof)
//   blob      - {iv, ciphertext} produced by AES-256-GCM on the device
//   updatedAt - server timestamp for conflict resolution
//
// Requires a KV binding named SYNC_KV (Cloudflare dashboard -> Settings -> Functions -> KV bindings).

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const MAX_BLOB = 3 * 1024 * 1024; // 3 MB ciphertext ceiling

// Constant-time-ish string compare
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sha256b64(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

const validId = (id) => typeof id === "string" && /^[A-Za-z0-9]{16,64}$/.test(id);

export async function onRequest(context) {
  const { request, env } = context;

  if (!env.SYNC_KV) {
    return json({ error: "sync-not-configured", detail: "KV binding SYNC_KV is missing" }, 501);
  }

  const url = new URL(request.url);

  if (request.method === "GET") {
    const id = url.searchParams.get("id");
    if (!validId(id)) return json({ error: "bad-id" }, 400);

    const raw = await env.SYNC_KV.get("sync:" + id);
    if (!raw) return json({ found: false }, 200);

    const rec = JSON.parse(raw);
    // Note: the ciphertext is returned to anyone who knows the syncId, but it is
    // useless without the password-derived key. Write access still requires authHash.
    return json({ found: true, blob: rec.blob, updatedAt: rec.updatedAt, version: rec.version || 1 });
  }

  if (request.method === "POST") {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "bad-json" }, 400);
    }

    const { id, authToken, blob, baseUpdatedAt } = body || {};
    if (!validId(id)) return json({ error: "bad-id" }, 400);
    if (typeof authToken !== "string" || authToken.length < 20) return json({ error: "bad-auth" }, 400);
    if (!blob || typeof blob.iv !== "string" || typeof blob.ciphertext !== "string")
      return json({ error: "bad-blob" }, 400);
    if (blob.ciphertext.length > MAX_BLOB) return json({ error: "too-large" }, 413);

    // Server stores only the hash of the auth token, so a KV leak cannot grant writes.
    const authHash = await sha256b64(authToken);

    const key = "sync:" + id;
    const raw = await env.SYNC_KV.get(key);

    if (!raw) {
      // First write claims the slot.
      const rec = { authHash, blob, updatedAt: Date.now(), version: 1 };
      await env.SYNC_KV.put(key, JSON.stringify(rec));
      return json({ ok: true, updatedAt: rec.updatedAt, version: rec.version, created: true });
    }

    const rec = JSON.parse(raw);
    if (!safeEqual(rec.authHash, authHash)) return json({ error: "unauthorized" }, 403);

    // Optimistic concurrency: reject if the server copy moved on since the client read it.
    if (typeof baseUpdatedAt === "number" && rec.updatedAt > baseUpdatedAt) {
      return json({ error: "conflict", serverUpdatedAt: rec.updatedAt, blob: rec.blob }, 409);
    }

    const next = { authHash, blob, updatedAt: Date.now(), version: (rec.version || 1) + 1 };
    await env.SYNC_KV.put(key, JSON.stringify(next));
    return json({ ok: true, updatedAt: next.updatedAt, version: next.version });
  }

  if (request.method === "DELETE") {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "bad-json" }, 400);
    }
    const { id, authToken } = body || {};
    if (!validId(id)) return json({ error: "bad-id" }, 400);
    const raw = await env.SYNC_KV.get("sync:" + id);
    if (!raw) return json({ ok: true, deleted: false });
    const rec = JSON.parse(raw);
    const authHash = await sha256b64(String(authToken || ""));
    if (!safeEqual(rec.authHash, authHash)) return json({ error: "unauthorized" }, 403);
    await env.SYNC_KV.delete("sync:" + id);
    return json({ ok: true, deleted: true });
  }

  return json({ error: "method-not-allowed" }, 405);
}
