"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/i18n/locale-context";

export function Hero() {
  const { t } = useLocale();
  const stats = [
    { v: t.hero.stat1, l: t.hero.stat1l },
    { v: t.hero.stat2, l: t.hero.stat2l },
    { v: t.hero.stat3, l: t.hero.stat3l },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[400px] w-[500px] rounded-full bg-secondary/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-36 pb-20 sm:px-8 sm:pt-44 sm:pb-28">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {t.hero.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="text-gradient">{t.hero.title}</span>{" "}
          <span className="text-accent">{t.hero.titleAccent}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mt-6 max-w-xl text-lg text-muted"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/catalog"
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover glow-accent"
          >
            {t.hero.cta}
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-border bg-surface/50 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-surface-2"
          >
            {t.hero.secondary}
          </Link>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-border pt-8"
        >
          {stats.map((s) => (
            <div key={s.l}>
              <dt className="text-3xl font-semibold text-white sm:text-4xl">{s.v}</dt>
              <dd className="mt-1 text-sm text-muted">{s.l}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
