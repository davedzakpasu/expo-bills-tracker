export function formatCurrency(n?: number) {
  const v = n ?? 0;
  return `$${v.toFixed(2)}`;
}

export function daysUntil(iso?: string) {
  if (!iso) return null;
  const now = new Date();
  const d = new Date(iso);
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 3600 * 24));
  return diff;
}
