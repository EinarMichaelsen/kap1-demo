"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "loading") return;

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Skriv inn en gyldig e-postadresse.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Noe gikk galt. Prøv igjen.");
      }

      setStatus("success");
      setMessage("Du er på listen! Vi sees 26. august. 🎉");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Noe gikk galt. Prøv igjen.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-brand-yellow px-6 py-5 text-maroon shadow-xl">
        <p className="font-display text-2xl tracking-wide">DU ER PÅ LISTEN!</p>
        <p className="mt-1 text-sm font-medium text-maroon/80">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="email" className="sr-only">
          E-postadresse
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="din@epost.no"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full flex-1 rounded-xl border-2 border-white/20 bg-white/95 px-5 py-4 text-base text-maroon-deep placeholder:text-maroon/40 outline-none transition focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/30"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap rounded-xl bg-brand-yellow px-7 py-4 font-display text-lg tracking-wide text-maroon-deep shadow-lg transition hover:bg-brand-orange hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "SENDER…" : "SIKRE PLASSEN MIN"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-sm font-medium text-brand-yellow">{message}</p>
      )}
      <p className="mt-3 text-xs text-white/60">
        Ingen spam. Vi sender deg kun praktisk info om kickoffen 26. august.
      </p>
    </form>
  );
}
