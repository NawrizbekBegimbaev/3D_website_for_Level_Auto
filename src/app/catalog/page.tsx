import type { Metadata } from "next";
import { CatalogClient } from "@/components/CatalogClient";
import { CatalogHeader } from "@/components/CatalogHeader";

export const metadata: Metadata = {
  title: "Каталог — LevelAuto",
  description: "Актуальное наличие премиальных автомобилей LevelAuto в Ташкенте.",
};

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-20 sm:px-8 sm:pt-32">
      <CatalogHeader />
      <CatalogClient />
    </div>
  );
}
