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
  /** gradient placeholder shown behind / until the photo loads */
  gradient: string;
  /** real photo in /public/cars (falls back to the gradient if absent) */
  image?: string;
  featured?: boolean;
}

// Каталог LevelAuto — работаем только с китайскими премиум-EV брендами:
// VOYAH, ZEEKR, XPENG, LEAPMOTOR, ROEWE. Заглушка под реальный фид/CMS.
const seedCars: Car[] = [
  // ---------------------------- VOYAH ----------------------------
  {
    id: "voyah-free-2025",
    brand: "VOYAH",
    model: "Free",
    year: 2025,
    priceUsd: 56900,
    mileageKm: 0,
    fuel: "electric",
    body: "suv",
    transmission: "automatic",
    power: 496,
    color: "Star Grey",
    gradient: "from-zinc-700 via-zinc-900 to-black",
    featured: true,
  },
  {
    id: "voyah-passion-2024",
    brand: "VOYAH",
    model: "Passion",
    year: 2024,
    priceUsd: 52500,
    mileageKm: 6200,
    fuel: "electric",
    body: "sedan",
    transmission: "automatic",
    power: 496,
    color: "Phantom Black",
    gradient: "from-slate-700 via-slate-900 to-black",
  },
  {
    id: "voyah-dreamer-2024",
    brand: "VOYAH",
    model: "Dreamer",
    year: 2024,
    priceUsd: 63000,
    mileageKm: 3100,
    fuel: "hybrid",
    body: "crossover",
    transmission: "automatic",
    power: 435,
    color: "Pearl White",
    gradient: "from-neutral-600 via-neutral-800 to-black",
  },

  // ---------------------------- ZEEKR ----------------------------
  {
    id: "zeekr-7x-2025",
    brand: "ZEEKR",
    model: "7X",
    year: 2025,
    priceUsd: 62000,
    mileageKm: 0,
    fuel: "electric",
    body: "suv",
    transmission: "automatic",
    power: 639,
    color: "Midnight Black",
    gradient: "from-red-900 via-zinc-900 to-black",
    featured: true,
  },
  {
    id: "zeekr-001-2024",
    brand: "ZEEKR",
    model: "001",
    year: 2024,
    priceUsd: 58500,
    mileageKm: 8400,
    fuel: "electric",
    body: "coupe",
    transmission: "automatic",
    power: 536,
    color: "Polar Blue",
    gradient: "from-sky-900 via-slate-900 to-black",
  },
  {
    id: "zeekr-009-2025",
    brand: "ZEEKR",
    model: "009",
    year: 2025,
    priceUsd: 76000,
    mileageKm: 0,
    fuel: "electric",
    body: "crossover",
    transmission: "automatic",
    power: 536,
    color: "Ivory",
    gradient: "from-stone-600 via-stone-800 to-black",
  },

  // ---------------------------- XPENG ----------------------------
  {
    id: "xpeng-g9-2025",
    brand: "XPENG",
    model: "G9",
    year: 2025,
    priceUsd: 54900,
    mileageKm: 0,
    fuel: "electric",
    body: "suv",
    transmission: "automatic",
    power: 551,
    color: "Silver Frost",
    gradient: "from-cyan-900 via-slate-900 to-black",
    featured: true,
  },
  {
    id: "xpeng-p7-2024",
    brand: "XPENG",
    model: "P7",
    year: 2024,
    priceUsd: 47900,
    mileageKm: 12500,
    fuel: "electric",
    body: "sedan",
    transmission: "automatic",
    power: 473,
    color: "Obsidian Black",
    gradient: "from-indigo-900 via-slate-900 to-black",
  },
  {
    id: "xpeng-g6-2024",
    brand: "XPENG",
    model: "G6",
    year: 2024,
    priceUsd: 41500,
    mileageKm: 9800,
    fuel: "electric",
    body: "suv",
    transmission: "automatic",
    power: 476,
    color: "Storm Grey",
    gradient: "from-zinc-800 via-zinc-900 to-black",
  },

  // -------------------------- LEAPMOTOR --------------------------
  {
    id: "leapmotor-c16-2025",
    brand: "LEAPMOTOR",
    model: "C16",
    year: 2025,
    priceUsd: 35900,
    mileageKm: 0,
    fuel: "hybrid",
    body: "suv",
    transmission: "automatic",
    power: 215,
    color: "Forest Green",
    gradient: "from-emerald-900 via-zinc-900 to-black",
  },
  {
    id: "leapmotor-c10-2024",
    brand: "LEAPMOTOR",
    model: "C10",
    year: 2024,
    priceUsd: 31500,
    mileageKm: 5400,
    fuel: "electric",
    body: "suv",
    transmission: "automatic",
    power: 218,
    color: "Metallic Grey",
    gradient: "from-teal-900 via-zinc-900 to-black",
  },

  // ---------------------------- ROEWE ----------------------------
  {
    id: "roewe-d7-ev-2024",
    brand: "ROEWE",
    model: "D7 EV",
    year: 2024,
    priceUsd: 28900,
    mileageKm: 14200,
    fuel: "electric",
    body: "sedan",
    transmission: "automatic",
    power: 204,
    color: "Graphite",
    gradient: "from-purple-900 via-zinc-900 to-black",
  },
  {
    id: "roewe-imax8-ev-2024",
    brand: "ROEWE",
    model: "iMAX8 EV",
    year: 2024,
    priceUsd: 42000,
    mileageKm: 7600,
    fuel: "electric",
    body: "crossover",
    transmission: "automatic",
    power: 245,
    color: "Champagne",
    gradient: "from-amber-900 via-zinc-900 to-black",
  },
];

// Attach the real photo for each car (public/cars/<id>.jpg).
export const cars: Car[] = seedCars.map((c) => ({ ...c, image: `/cars/${c.id}.jpg` }));

export const brands = [...new Set(cars.map((c) => c.brand))].sort();
export const bodies: Body[] = ["sedan", "suv", "coupe", "crossover"];
export const fuels: Fuel[] = ["petrol", "diesel", "hybrid", "electric"];

export function getCar(id: string): Car | undefined {
  return cars.find((c) => c.id === id);
}
