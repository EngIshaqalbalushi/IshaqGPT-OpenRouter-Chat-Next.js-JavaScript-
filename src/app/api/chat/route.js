// GET for quick sanity check in the browser
export async function GET() {
  return Response.json({ ok: true, msg: "API alive" });
}

export async function POST(req) {
  try {
    const { message } = await req.json();

    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": process.env.SITE_NAME || "My OpenRouter Demo",
      },
      body: JSON.stringify({
        model: process.env.MODEL || "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [{ role: "user", content: message }],
      }),
    });

    const ct = r.headers.get("content-type") || "";
    const raw = await r.text();

    if (!r.ok) return new Response(JSON.stringify({ error: raw }), { status: 500 });
    if (!ct.includes("application/json"))
      return new Response(JSON.stringify({ error: "Upstream returned non-JSON", raw }), { status: 500 });

    const data = JSON.parse(raw);
    return Response.json({ reply: data?.choices?.[0]?.message?.content ?? "" });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
