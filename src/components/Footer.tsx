"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { PHONES, SOCIALS, telHref } from "@/data/contacts";
import { useLocale } from "@/i18n/locale-context";

export function Footer() {
  const { t } = useLocale();
  const pathname = usePathname();
  // The home page carries the footer inside the 3D showcase (final stage),
  // so the global footer is suppressed there to avoid a duplicate.
  if (pathname === "/") return null;

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-3">
        <div className="space-y-3">
          <Logo className="h-14 w-auto" />
          <p className="max-w-xs text-sm text-muted">{t.footer.tagline}</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium text-white">{t.nav.catalog}</p>
          <Link href="/catalog" className="block text-muted hover:text-white">{t.catalog.title}</Link>
          <Link href="/#about" className="block text-muted hover:text-white">{t.nav.about}</Link>
          <Link href="/contact" className="block text-muted hover:text-white">{t.nav.contact}</Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium text-white">{t.nav.contact}</p>
          <p className="text-muted">{t.footer.address}</p>
          {PHONES.map((phone) => (
            <a key={phone} href={telHref(phone)} className="block text-muted hover:text-white">
              {phone}
            </a>
          ))}

          <p className="pt-3 font-medium text-white">{t.footer.social}</p>
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-muted hover:text-white"
            >
              {s.name} · {s.handle}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:px-8">
          <span>© {new Date().getFullYear()} LevelAuto. {t.footer.rights}</span>
          <span>Tashkent · Uzbekistan</span>
        </div>
      </div>
    </footer>
  );
}
