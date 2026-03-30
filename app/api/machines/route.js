export async function GET() {
  try {
    const res = await fetch(process.env.GAS_URL + "?action=getMachines", {
      cache: "no-store",
    });
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
