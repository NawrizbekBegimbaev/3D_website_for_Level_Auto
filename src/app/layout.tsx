import type { Metadata } from "next";
import { Montserrat, Manrope } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/i18n/locale-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Paired type: a bold geometric grotesque for headlines — echoing the
// LevelAuto wordmark (tight, modern, automotive) — + Manrope for body.
// Both carry Cyrillic (RU/UZ).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
  display: "swap",
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LevelAuto — премиальные автомобили в Ташкенте",
  description:
    "LevelAuto — эксклюзивный подбор, проверка и доставка автомобилей класса люкс по Узбекистану. RU / UZ / EN.",
  openGraph: {
    title: "LevelAuto — премиальные автомобили нового уровня",
    description: "Эксклюзивный подбор и доставка автомобилей класса люкс по Узбекистану.",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${montserrat.variable} ${manrope.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <LocaleProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
