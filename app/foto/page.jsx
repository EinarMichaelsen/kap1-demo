import Link from "next/link";
import CameraAnalyzer from "../components/CameraAnalyzer";

export const metadata = {
  title: "KAP1 — Foto-AI",
  description: "Ta et bilde og la en AI-modell beskrive det.",
};

export default function FotoPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 vignette" />

      <section className="relative mx-auto flex max-w-md flex-col items-center px-6 pt-14 pb-20 text-center">
        <Link
          href="/"
          className="self-start text-sm font-semibold text-white/60 transition hover:text-white"
        >
          ← Tilbake
        </Link>

        <span
          className="logo-kap1 mt-6 text-5xl sm:text-6xl"
          data-text="KAP1"
        >
          KAP1
        </span>

        <h1 className="mt-6 font-display text-2xl uppercase tracking-[0.1em] text-brand-yellow">
          Foto-AI
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Ta et bilde, så sender vi det til en AI-modell og viser deg svaret.
        </p>

        <div className="mt-8 w-full">
          <CameraAnalyzer />
        </div>
      </section>
    </main>
  );
}
