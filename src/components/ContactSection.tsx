"use client";

import { Reveal } from "./Reveal";
import { ContactForm } from "./ContactForm";
import { PHONES, SOCIALS, telHref } from "@/data/contacts";
import { useLocale } from "@/i18n/locale-context";

export function ContactSection() {
  const { t } = useLocale();
  return (
    <section id="contact" className="scroll-mt-20">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.contact.title}</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">{t.contact.subtitle}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 rounded-3xl border border-border bg-surface/50 p-6 sm:p-8">
          <ContactForm />
        </Reveal>

        <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {PHONES.map((phone) => (
            <a key={phone} href={telHref(phone)} className="font-medium text-white hover:text-accent">
              {phone}
            </a>
          ))}
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-white"
            >
              {s.name}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
