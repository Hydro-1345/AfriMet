import type { FoodRegion } from "@/lib/foods/constants";

export type FoodCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Food = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  region: FoodRegion;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  servingDescription: string | null;
  servingGrams: number | null;
  isDiaspora: boolean;
  aliases: string[];
  createdAt: string;
  updatedAt: string;
};

export type FoodCategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type FoodRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  region: FoodRegion;
  category_id: string;
  serving_description: string | null;
  serving_grams: number | null;
  is_diaspora: boolean;
  created_at: string;
  updated_at: string;
};

export type FoodAliasRow = {
  id: string;
  food_id: string;
  alias: string;
  alias_normalized: string;
  created_at: string;
};

export type FoodSearchRow = FoodRow & {
  category_slug: string;
  category_name: string;
  total_count: number;
};

export type FoodSearchResult = {
  foods: Food[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type FoodActionResult = {
  error?: string;
  success?: boolean;
  foods?: Food[];
  food?: Food;
  categories?: FoodCategory[];
  search?: FoodSearchResult;
};
