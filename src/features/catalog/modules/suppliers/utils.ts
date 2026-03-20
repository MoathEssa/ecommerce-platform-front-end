export function formatPrice(p: string | null | undefined): string {
  if (!p) return "—";
  const num = parseFloat(p);
  return isNaN(num) ? p : `$${num.toFixed(2)}`;
}
