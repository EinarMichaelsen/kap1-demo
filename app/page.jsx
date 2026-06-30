import WaitlistForm from "./components/WaitlistForm";
import Countdown from "./components/Countdown";

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/80">
      {children}
    </span>
  );
}

function ValueCard({ emoji, title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-brand-yellow/40 hover:bg-white/[0.07]">
      <div className="text-3xl">{emoji}</div>
      <h3 className="mt-4 font-display text-2xl tracking-wide text-brand-yellow">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{children}</p>
    </div>
  );
}

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 vignette" />

      {/* HERO */}
      <section className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28">
        <div className="animate-floaty">
          <span
            className="logo-kap1 text-7xl sm:text-8xl md:text-9xl"
            data-text="KAP1"
          >
            KAP1
          </span>
        </div>

        <p className="mt-6 font-display text-xl uppercase tracking-[0.12em] text-brand-yellow sm:text-2xl">
          Herfra kommer det neste store
        </p>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
          KAP1 gir deg kunnskapen og verktøyene du trenger for å starte ditt
          eget selskap — fra idé til ekte business. Vi sparker det hele i gang
          med en kickoff du ikke vil gå glipp av.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Pill>📅 Kickoff 26. august 2026</Pill>
          <Pill>📍 Oslo &amp; digitalt</Pill>
          <Pill>🎟️ Begrenset antall plasser</Pill>
        </div>

        <div className="mt-10">
          <Countdown />
        </div>

        {/* WAITLIST */}
        <div className="mt-12 w-full max-w-xl">
          <h2 className="font-display text-2xl tracking-wide text-white sm:text-3xl">
            SIKRE PLASSEN DIN PÅ VENTELISTEN
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Bli først til å få invitasjon, program og early bird-tilgang.
          </p>
          <div className="mt-5">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="relative mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-5 sm:grid-cols-3">
          <ValueCard emoji="🧠" title="KUNNSKAP">
            Lær det du faktisk trenger — fra forretningsmodell og kundeforståelse
            til finansiering. Ingen tørr teori, kun det som flytter deg framover.
          </ValueCard>
          <ValueCard emoji="🛠️" title="VERKTØY">
            Konkrete maler, rammeverk og verktøy du kan ta i bruk fra dag én for
            å gå fra idé til lansering.
          </ValueCard>
          <ValueCard emoji="🤝" title="NETTVERK">
            Møt andre gründerspirer, mentorer og folk som har gjort det før.
            Det neste store bygges sjelden alene.
          </ValueCard>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl tracking-wide text-brand-yellow sm:text-4xl">
          HAR DU EN IDÉ DU ALDRI HAR TURT Å STARTE?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          Da er dette for deg. Meld deg på ventelisten nå — det koster ingenting,
          og du forplikter deg ikke til noe. Du sikrer deg bare førsteretten når
          dørene åpner.
        </p>
        <div className="mx-auto mt-8 max-w-xl">
          <WaitlistForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-white/10 px-6 py-10 text-center">
        <span className="logo-kap1 text-3xl" data-text="KAP1">
          KAP1
        </span>
        <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-white/70">
          Hold deg oppdatert på{" "}
          <a href="https://www.kap1.no" className="text-brand-yellow underline">
            www.kap1.no
          </a>
        </p>
        <p className="mt-2 text-xs text-white/40">
          © {new Date().getFullYear()} KAP1. Herfra kommer det neste store
        </p>
        <p className="mt-4 text-xs">
          <a href="/foto" className="text-white/50 underline hover:text-white">
            Prøv Foto-AI →
          </a>
        </p>
      </footer>
    </main>
  );
}
