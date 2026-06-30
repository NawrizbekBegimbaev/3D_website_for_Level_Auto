export function formatPrice(usd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
}

export function formatKm(km: number): string {
  return new Intl.NumberFormat("ru-RU").format(km) + " km";
}
