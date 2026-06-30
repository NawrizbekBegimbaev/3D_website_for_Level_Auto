"use client";

import { Reveal } from "./Reveal";
import { useLocale } from "@/i18n/locale-context";

export function About() {
  const { t } = useLocale();
  const items = [
    { t: t.about.p1t, b: t.about.p1b },
    { t: t.about.p2t, b: t.about.p2b },
    { t: t.about.p3t, b: t.about.p3b },
  ];

  return (
    <section id="about" className="scroll-mt-20 border-y border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.about.title}</h2>
          <p className="mt-3 text-lg text-muted">{t.about.body}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-border bg-surface p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent font-semibold">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">{it.t}</h3>
                <p className="mt-2 text-sm text-muted">{it.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
