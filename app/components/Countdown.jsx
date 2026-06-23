"use client";

import { useEffect, useState } from "react";

// Kickoff: 26. august 2026, kl. 18:00 norsk tid (CEST = UTC+2).
const TARGET = new Date("2026-08-26T18:00:00+02:00").getTime();

function diff() {
  const now = Date.now();
  const total = Math.max(0, TARGET - now);
  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-4xl tabular-nums text-brand-yellow sm:text-5xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/60">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(diff());
    const id = setInterval(() => setTime(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  // Avoid hydration mismatch: render placeholder until mounted.
  if (!time) {
    return <div className="h-[72px]" aria-hidden />;
  }

  if (time.total <= 0) {
    return (
      <p className="font-display text-2xl tracking-wide text-brand-yellow">
        KICKOFFEN ER I GANG! 🚀
      </p>
    );
  }

  return (
    <div className="flex items-center gap-5 sm:gap-8">
      <Unit value={time.days} label="Dager" />
      <Unit value={time.hours} label="Timer" />
      <Unit value={time.minutes} label="Min" />
      <Unit value={time.seconds} label="Sek" />
    </div>
  );
}
