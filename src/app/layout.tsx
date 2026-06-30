import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/i18n/locale-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="ru" className={`${inter.variable} h-full`}>
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
