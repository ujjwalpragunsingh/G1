// Saves each website inquiry as a row in the studio's Google Sheet (setup in README).
// Without INQUIRY_SHEET_URL it does nothing; the inquiry still reaches WhatsApp either way.

const FIELDS = ["name", "email", "date", "set", "duration", "crew", "details"] as const;

export async function POST(request: Request) {
  const sheetUrl = process.env.INQUIRY_SHEET_URL;
  if (!sheetUrl) return new Response(null, { status: 204 });

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return new Response(null, { status: 400 });

  // Only the known fields, as short plain text, are passed on
  const values = body as Record<string, unknown>;
  const row = Object.fromEntries(
    FIELDS.map((key) => [key, typeof values[key] === "string" ? values[key].slice(0, 2000) : ""])
  );
  if (!row.name) return new Response(null, { status: 400 });

  const saved = await fetch(sheetUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  }).catch(() => null);

  return new Response(null, { status: saved?.ok ? 204 : 502 });
}
