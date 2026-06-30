export type Fuel = "petrol" | "diesel" | "hybrid" | "electric";
export type Body = "sedan" | "suv" | "coupe" | "crossover";

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  priceUsd: number;
  mileageKm: number;
  fuel: Fuel;
  body: Body;
  transmission: "automatic" | "manual";
  power: number; // hp
  color: string;
  /** gradient used as a placeholder visual until real photos are wired in */
  gradient: string;
  featured?: boolean;
}

// Seed catalog — заглушка под реальный фид/CMS LevelAuto.
export const cars: Car[] = [
  {
    id: "bmw-x7-2023",
    brand: "BMW",
    model: "X7 xDrive40i",
    year: 2023,
    priceUsd: 98500,
    mileageKm: 12000,
    fuel: "petrol",
    body: "suv",
    transmission: "automatic",
    power: 380,
    color: "Carbon Black",
    gradient: "from-zinc-700 via-zinc-900 to-black",
    featured: true,
  },
  {
    id: "mercedes-eqs-2024",
    brand: "Mercedes-Benz",
    model: "EQS 580 4MATIC",
    year: 2024,
    priceUsd: 134000,
    mileageKm: 4500,
    fuel: "electric",
    body: "sedan",
    transmission: "automatic",
    power: 523,
    color: "Obsidian Black",
    gradient: "from-blue-900 via-slate-900 to-black",
    featured: true,
  },
  {
    id: "audi-q8-2023",
    brand: "Audi",
    model: "Q8 55 TFSI quattro",
    year: 2023,
    priceUsd: 89900,
    mileageKm: 21000,
    fuel: "petrol",
    body: "crossover",
    transmission: "automatic",
    power: 340,
    color: "Mythos Black",
    gradient: "from-neutral-700 via-neutral-900 to-black",
    featured: true,
  },
  {
    id: "porsche-taycan-2023",
    brand: "Porsche",
    model: "Taycan 4S",
    year: 2023,
    priceUsd: 119000,
    mileageKm: 9800,
    fuel: "electric",
    body: "sedan",
    transmission: "automatic",
    power: 530,
    color: "Volcano Grey",
    gradient: "from-stone-600 via-stone-800 to-black",
  },
  {
    id: "lexus-lx600-2022",
    brand: "Lexus",
    model: "LX 600",
    year: 2022,
    priceUsd: 112000,
    mileageKm: 28000,
    fuel: "petrol",
    body: "suv",
    transmission: "automatic",
    power: 415,
    color: "Onyx",
    gradient: "from-zinc-800 via-zinc-900 to-black",
  },
  {
    id: "tesla-model-s-2023",
    brand: "Tesla",
    model: "Model S Plaid",
    year: 2023,
    priceUsd: 109900,
    mileageKm: 15000,
    fuel: "electric",
    body: "sedan",
    transmission: "automatic",
    power: 1020,
    color: "Solid Black",
    gradient: "from-red-900 via-zinc-900 to-black",
  },
];

export const brands = [...new Set(cars.map((c) => c.brand))].sort();
export const bodies: Body[] = ["sedan", "suv", "coupe", "crossover"];
export const fuels: Fuel[] = ["petrol", "diesel", "hybrid", "electric"];

export function getCar(id: string): Car | undefined {
  return cars.find((c) => c.id === id);
}
