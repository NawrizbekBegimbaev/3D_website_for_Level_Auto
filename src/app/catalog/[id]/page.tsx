import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cars, getCar } from "@/data/cars";
import { CarDetail } from "@/components/CarDetail";

export function generateStaticParams() {
  return cars.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = getCar(id);
  if (!car) return { title: "LevelAuto" };
  return {
    title: `${car.brand} ${car.model} — LevelAuto`,
    description: `${car.brand} ${car.model}. LevelAuto, Ташкент.`,
  };
}

export default async function CarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = getCar(id);
  if (!car) notFound();
  return <CarDetail car={car} />;
}
