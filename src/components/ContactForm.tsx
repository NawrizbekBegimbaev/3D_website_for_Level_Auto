"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/locale-context";

/** Posted to the Cloudflare Worker (worker/index.ts), which relays it to Telegram. */
const LEAD_ENDPOINT = "/api/lead";

export function ContactForm({ subject }: { subject?: string }) {
  const { t, locale } = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          message: data.get("message"),
          subject: subject ?? "",
          company: data.get("company"), // honeypot
          locale,
          page: typeof window === "undefined" ? "" : window.location.pathname,
        }),
      });
      if (!res.ok) throw new Error(`lead failed: ${res.status}`);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/25";

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-accent/40 bg-accent/10 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">✓</div>
        <p className="mt-4 text-white">{t.contact.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input required name="name" placeholder={t.contact.name} className={inputClass} />
        <input required name="phone" type="tel" placeholder={t.contact.phone} className={inputClass} />
      </div>
      <textarea
        name="message"
        rows={4}
        placeholder={t.contact.message}
        defaultValue={subject ? `${t.car.request}: ${subject}` : ""}
        className={`${inputClass} resize-none`}
      />

      {/* Honeypot: off-screen, never focusable, no autofill. Bots fill it in;
          the Worker then drops the submission. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {status === "error" && (
        <p className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-white">
          {t.contact.error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-hover active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100"
      >
        {status === "sending" ? t.contact.sending : t.contact.send}
      </button>
    </form>
  );
}
