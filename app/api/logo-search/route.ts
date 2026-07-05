export async function GET(request: Request) {
    const q = new URL(request.url).searchParams.get("q");
    if (!q || !q.trim()) {
        return Response.json([]);
    }

    const secret = process.env.LOGO_DEV_SECRET_KEY;
    if(!secret) {
        return Response.json({ error: "Server not configured" }, {status: 500});
    }

    const res = await fetch(
        `https://api.logo.dev/search?q=${encodeURIComponent(q)}`,
        { headers: { Authorization: `Bearer ${secret}` } }
    );
    if(!res.ok) {
        console.error("logo.dev search failed", res.status);
        return Response.json([]);
    }

    const data = await res.json();
    return Response.json(data);
}