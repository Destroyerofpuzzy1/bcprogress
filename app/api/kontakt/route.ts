import { NextResponse } from "next/server";

/**
 * Odbiór zapytania z formularza.
 *
 * Wysyłka działa dopiero po ustawieniu zmiennych środowiskowych:
 *   RESEND_API_KEY, CONTACT_TO, CONTACT_FROM
 * Bez nich endpoint zwraca 501 i nie udaje, że wiadomość poszła.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  const imie = String(body.imie ?? "").trim();
  const telefon = String(body.telefon ?? "").trim();
  const rodzaj = String(body.rodzaj ?? "").trim();
  const wiadomosc = String(body.wiadomosc ?? "").trim();
  const zgoda = body.zgoda === true;

  if (!imie || !telefon || !zgoda) {
    return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;

  if (!key || !to || !from) {
    return NextResponse.json(
      { ok: false, code: "not_configured" },
      { status: 501 },
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Zapytanie ze strony — ${imie}`,
      text: [
        `Imię: ${imie}`,
        `Telefon: ${telefon}`,
        `Rodzaj inwestycji: ${rodzaj || "—"}`,
        "",
        wiadomosc || "—",
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, code: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
