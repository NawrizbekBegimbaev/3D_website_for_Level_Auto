import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Контакты — LevelAuto",
  description: "Свяжитесь с LevelAuto в Ташкенте — подбор и доставка премиальных автомобилей.",
};

export default function ContactPage() {
  return (
    <div className="pt-16">
      <ContactSection />
    </div>
  );
}
