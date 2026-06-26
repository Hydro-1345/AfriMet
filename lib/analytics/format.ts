export function formatAnalyticsNumber(value: number | null, unit?: string): string {
  if (value === null) {
    return "—";
  }

  const rounded = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return unit ? `${rounded} ${unit}` : rounded;
}

export function formatAnalyticsInteger(value: number): string {
  return value.toLocaleString();
}
