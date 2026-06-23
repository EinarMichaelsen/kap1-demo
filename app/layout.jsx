import "./globals.css";
import { Anton, Inter } from "next/font/google";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://kap1.no"),
  title: "KAP1 — Herfra kommer det neste store",
  description:
    "KAP1 gir deg kunnskap og verktøyene du trenger for å starte ditt eget selskap. Bli med på kickoff 26. august. Sikre plassen din på ventelisten.",
  openGraph: {
    title: "KAP1 — Herfra kommer det neste store",
    description:
      "Kickoff 26. august. Kunnskapen og verktøyene du trenger for å starte ditt eget selskap. Sikre plassen din.",
    type: "website",
    locale: "nb_NO",
  },
  twitter: {
    card: "summary_large_image",
    title: "KAP1 — Herfra kommer det neste store",
    description:
      "Kickoff 26. august. Kunnskapen og verktøyene du trenger for å starte ditt eget selskap.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="nb" className={`${anton.variable} ${inter.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
