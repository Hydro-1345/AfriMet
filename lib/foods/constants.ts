export const FOOD_REGIONS = [
  { value: "west_africa", label: "West Africa" },
  { value: "east_africa", label: "East Africa" },
  { value: "southern_africa", label: "Southern Africa" },
  { value: "north_africa", label: "North Africa" },
  { value: "diaspora", label: "Diaspora" },
] as const;

export type FoodRegion = (typeof FOOD_REGIONS)[number]["value"];

export const DEFAULT_FOOD_PAGE_SIZE = 20;

export const MAX_FOOD_PAGE_SIZE = 50;

export const MAX_FOOD_SEARCH_LENGTH = 100;
