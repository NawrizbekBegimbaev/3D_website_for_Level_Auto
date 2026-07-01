"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/locale-context";

export function ContactForm({ subject }: { subject?: string }) {
  const { t } = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Demo only — wire to LevelAuto CRM / Telegram bot / email here.
    setTimeout(() => setStatus("done"), 700);
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
      {subject && <input type="hidden" name="subject" value={subject} />}
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
