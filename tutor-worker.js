// ============================================================
// Cloudflare Worker — AI tutor proxy for elufisantemidayo.com
// ============================================================
// Deploy instructions are in DEPLOY.md. This worker:
//   1) Receives {system, messages[]} from the site's tutor widget
//   2) Calls Anthropic's Messages API using a server-side key
//   3) Returns {reply: "..."} as JSON
//   4) Restricts CORS to your own domain

const ALLOWED_ORIGINS = [
  "https://elufisantemidayo.com",
  "https://www.elufisantemidayo.com",
  "https://ptemidayo.github.io",
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    const cors = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return new Response("POST only", { status: 405, headers: cors });

    let body;
    try { body = await request.json(); }
    catch { return json({ error: "bad json" }, 400, cors); }

    const { system = "", messages = [] } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: "empty messages" }, 400, cors);
    }
    // Soft rate limit: cap on message length & count
    const trimmed = messages.slice(-12).map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 2000),
    }));

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        system,
        messages: trimmed,
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return json({ error: "upstream", detail: t.slice(0, 400) }, 502, cors);
    }
    const data = await r.json();
    const reply = (data.content || []).map(c => c.text || "").join("").trim();
    return json({ reply }, 200, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
