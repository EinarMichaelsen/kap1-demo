import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// The SDK needs Node APIs, so this route runs on the Node.js runtime (not edge).
export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-opus-4-8";

const ALLOWED_MEDIA_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

// Roughly 5 MB of base64 (~3.7 MB of image). Bigger than this and the request
// is almost certainly an un-resized full-resolution photo.
const MAX_BASE64_LENGTH = 7_000_000;

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Mangler ANTHROPIC_API_KEY. Legg den til som miljøvariabel i Vercel.",
      },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørsel." }, { status: 400 });
  }

  const mediaType = body?.mediaType || "image/jpeg";
  const imageBase64 = body?.imageBase64;
  const prompt =
    (typeof body?.prompt === "string" && body.prompt.trim()) ||
    "Hva ser du på dette bildet? Beskriv det kort og tydelig på norsk.";

  if (!imageBase64 || typeof imageBase64 !== "string") {
    return NextResponse.json(
      { error: "Bildet mangler. Ta et bilde og prøv igjen." },
      { status: 400 }
    );
  }

  if (!ALLOWED_MEDIA_TYPES.has(mediaType)) {
    return NextResponse.json(
      { error: "Bildeformatet støttes ikke." },
      { status: 400 }
    );
  }

  if (imageBase64.length > MAX_BASE64_LENGTH) {
    return NextResponse.json(
      { error: "Bildet er for stort. Prøv et mindre bilde." },
      { status: 413 }
    );
  }

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageBase64,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const answer = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return NextResponse.json({ answer: answer || "(Tomt svar fra modellen.)" });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      const status = err.status >= 500 ? 502 : err.status || 502;
      return NextResponse.json(
        { error: "AI-modellen svarte med en feil. Prøv igjen." },
        { status }
      );
    }
    return NextResponse.json(
      { error: "Klarte ikke å analysere bildet. Prøv igjen." },
      { status: 502 }
    );
  }
}
