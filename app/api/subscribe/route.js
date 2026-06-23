import { NextResponse } from "next/server";

export const runtime = "edge";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørsel." }, { status: 400 });
  }

  const email = (body?.email || "").trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Skriv inn en gyldig e-postadresse." },
      { status: 400 }
    );
  }

  // Where signups go. Set FORMSPREE_ENDPOINT in your environment to receive
  // every email in your Formspree dashboard / inbox. See README for the
  // 30-second setup. Without it, the form still works (demo mode) so the page
  // is never broken — it just doesn't persist the address.
  const endpoint = process.env.FORMSPREE_ENDPOINT;

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          source: "kap1-landing",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: "Klarte ikke å lagre påmeldingen. Prøv igjen." },
          { status: 502 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Klarte ikke å lagre påmeldingen. Prøv igjen." },
        { status: 502 }
      );
    }
  } else {
    // Demo mode — visible in the server logs so you can confirm it works.
    console.log(`[kap1-waitlist] (demo, ikke lagret) ${email}`);
  }

  return NextResponse.json({ ok: true });
}
