import { FOOD_REGIONS } from "@/lib/foods/constants";
import type { FoodRegion } from "@/lib/foods/constants";

export function getFoodRegionLabel(region: FoodRegion): string {
  return FOOD_REGIONS.find((item) => item.value === region)?.label ?? region;
}

export function formatServing(
  servingDescription: string | null,
  servingGrams: number | null
): string | null {
  if (!servingDescription && servingGrams === null) {
    return null;
  }

  if (servingDescription && servingGrams !== null) {
    return `${servingDescription} (~${servingGrams} g)`;
  }

  return servingDescription ?? `~${servingGrams} g`;
}
