export function formatPrice(amount: number, currencyCode = "SAR"): string {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
