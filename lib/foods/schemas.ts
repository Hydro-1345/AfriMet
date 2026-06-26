import { z } from "zod";
import {
  DEFAULT_FOOD_PAGE_SIZE,
  FOOD_REGIONS,
  MAX_FOOD_PAGE_SIZE,
  MAX_FOOD_SEARCH_LENGTH,
} from "@/lib/foods/constants";

const regionValues = FOOD_REGIONS.map((region) => region.value) as [
  (typeof FOOD_REGIONS)[number]["value"],
  ...(typeof FOOD_REGIONS)[number]["value"][],
];

const optionalRegionSchema = z
  .union([z.enum(regionValues), z.literal("")])
  .transform((value) => (value === "" ? undefined : value))
  .optional();

const optionalCategorySlugSchema = z
  .string()
  .max(80, "Category filter is too long.")
  .transform((value) => (value.trim() === "" ? undefined : value.trim()))
  .optional();

export const foodSearchSchema = z.object({
  query: z
    .string()
    .max(MAX_FOOD_SEARCH_LENGTH, "Search query is too long.")
    .transform((value) => value.trim())
    .optional()
    .default(""),
  category: optionalCategorySlugSchema,
  region: optionalRegionSchema,
  page: z.coerce
    .number()
    .int("Page must be a whole number.")
    .min(1, "Page must be at least 1.")
    .optional()
    .default(1),
  pageSize: z.coerce
    .number()
    .int("Page size must be a whole number.")
    .min(1, "Page size must be at least 1.")
    .max(MAX_FOOD_PAGE_SIZE, `Page size cannot exceed ${MAX_FOOD_PAGE_SIZE}.`)
    .optional()
    .default(DEFAULT_FOOD_PAGE_SIZE),
});

export const foodSlugSchema = z
  .string()
  .min(1, "Food slug is required.")
  .max(120, "Food slug is too long.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid food slug.");

export type FoodSearchInput = z.input<typeof foodSearchSchema>;
export type FoodSearchParams = z.output<typeof foodSearchSchema>;
