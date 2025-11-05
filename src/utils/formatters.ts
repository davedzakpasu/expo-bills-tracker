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

export function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-CA");
}

export const toLocalISODate = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
};
