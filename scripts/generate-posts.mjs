import sharp from "sharp";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "marketing");
mkdirSync(OUT, { recursive: true });

// Brand
const MAROON = "#7d3f40";
const MAROON_DEEP = "#5a2d2e";
const ORANGE = "#f97316";
const YELLOW = "#ffd60a";
const WHITE = "#ffffff";

// Embed the Anton brand font so text renders identically everywhere.
const fontB64 = readFileSync(join(__dirname, "Anton-Regular.ttf")).toString("base64");
const fontFace = `@font-face{font-family:'Anton';src:url(data:font/ttf;base64,${fontB64}) format('truetype');}`;

const W = 1080;
const H = 1080;

// XML-escape helper for text content.
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// The KAP1 wordmark: orange offset block behind yellow letters.
function wordmark(cx, cy, size) {
  const dx = size * 0.018;
  const dy = size * 0.018;
  return `
    <text x="${cx + dx}" y="${cy + dy}" font-family="Anton" font-size="${size}"
      fill="${ORANGE}" text-anchor="middle" letter-spacing="-2">KAP1</text>
    <text x="${cx}" y="${cy}" font-family="Anton" font-size="${size}"
      fill="${YELLOW}" text-anchor="middle" letter-spacing="-2">KAP1</text>`;
}

// Stacked uppercase headline lines.
function headline(lines, cx, startY, size, fill, lineGap = 1.05, anchor = "middle") {
  return lines
    .map(
      (ln, i) =>
        `<text x="${cx}" y="${startY + i * size * lineGap}" font-family="Anton"
          font-size="${size}" fill="${fill}" text-anchor="${anchor}"
          letter-spacing="-1">${esc(ln)}</text>`
    )
    .join("\n");
}

function frame(inner, bg = MAROON) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>${fontFace}</style>
    <radialGradient id="vig" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.06"/>
      <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.28"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  ${inner}
</svg>`;
}

// Small uppercase label with a pill background.
function pill(text, cx, cy, fontSize = 30) {
  const padX = 34;
  const w = text.length * fontSize * 0.6 + padX * 2;
  const h = fontSize * 1.9;
  return `
    <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${h / 2}"
      fill="${YELLOW}"/>
    <text x="${cx}" y="${cy + fontSize * 0.36}" font-family="Anton" font-size="${fontSize}"
      fill="${MAROON_DEEP}" text-anchor="middle" letter-spacing="1">${esc(text)}</text>`;
}

const posts = [
  {
    name: "01-teaser",
    svg: frame(`
      ${wordmark(W / 2, 470, 240)}
      ${headline(["HERFRA KOMMER", "DET NESTE STORE"], W / 2, 640, 64, YELLOW, 1.1)}
      ${headline(["NOE STORT ER PÅ VEI.", "FØLG MED."], W / 2, 880, 38, WHITE, 1.3)}
    `),
  },
  {
    name: "02-kickoff",
    svg: frame(`
      ${pill("KICKOFF", W / 2, 250, 40)}
      ${headline(["26.", "AUGUST"], W / 2, 480, 150, YELLOW, 0.95)}
      ${headline(["Bli med når KAP1 sparker", "i gang reisen mot ditt", "eget selskap."], W / 2, 700, 44, WHITE, 1.25)}
      ${pill("SIKRE PLASSEN — LINK I BIO", W / 2, 960, 34)}
    `),
  },
  {
    name: "03-hook",
    svg: frame(`
      ${headline(["HAR DU EN", "IDÉ DU ALDRI", "HAR TURT", "Å STARTE?"], W / 2, 300, 120, YELLOW, 1.0)}
      ${headline(["KAP1 gir deg kunnskapen og", "verktøyene for å gå fra idé", "til ekte business."], W / 2, 850, 40, WHITE, 1.3)}
      ${pill("MELD DEG PÅ VENTELISTEN", W / 2, 1010, 32)}
    `),
  },
  {
    name: "04-verdier",
    svg: frame(`
      ${headline(["DETTE FÅR DU"], W / 2, 230, 80, YELLOW, 1.0)}
      ${headline(["🧠  KUNNSKAP"], W / 2, 430, 76, WHITE, 1.0, "middle")}
      ${headline(["🛠️  VERKTØY"], W / 2, 580, 76, WHITE, 1.0, "middle")}
      ${headline(["🤝  NETTVERK"], W / 2, 730, 76, WHITE, 1.0, "middle")}
      ${headline(["Alt du trenger for å starte", "ditt eget selskap."], W / 2, 880, 40, YELLOW, 1.3)}
      ${pill("KICKOFF 26. AUGUST", W / 2, 1000, 32)}
    `),
  },
];

for (const p of posts) {
  const svgPath = join(OUT, `${p.name}.svg`);
  const pngPath = join(OUT, `${p.name}.png`);
  writeFileSync(svgPath, p.svg);
  await sharp(Buffer.from(p.svg)).png().toFile(pngPath);
  console.log("✓", `${p.name}.png`);
}

console.log("\nAlle Instagram-poster generert i /marketing");
