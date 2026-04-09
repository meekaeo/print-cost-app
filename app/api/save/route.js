export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(process.env.GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
