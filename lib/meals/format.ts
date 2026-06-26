import { format } from "date-fns";
import type { Meal } from "@/types/meal";

export function formatMealDate(value: string): string {
  return format(new Date(value), "EEE, d MMM yyyy 'at' h:mm a");
}

export function formatMealDateShort(value: string): string {
  return format(new Date(value), "d MMM yyyy, h:mm a");
}

export function toDateTimeLocalValue(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function getDefaultMealDateValue(): string {
  return toDateTimeLocalValue(new Date());
}

export function truncateDescription(description: string, maxLength = 120): string {
  if (description.length <= maxLength) {
    return description;
  }

  return `${description.slice(0, maxLength).trimEnd()}…`;
}

export function hasMealImage(meal: Meal): boolean {
  return Boolean(meal.imageSignedUrl);
}
