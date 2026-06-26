"use server";

import { fetchFoodBySlug, fetchFoodCategories, searchFoods } from "@/lib/foods/queries";
import { type FoodSearchInput, foodSearchSchema, foodSlugSchema } from "@/lib/foods/schemas";
import { createClient } from "@/lib/supabase/server";
import type {
  Food,
  FoodActionResult,
  FoodCategory,
  FoodSearchResult,
} from "@/types/food";

async function requireAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function getFoodCategoriesAction(): Promise<FoodCategory[]> {
  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return [];
  }

  const supabase = await createClient();
  return fetchFoodCategories(supabase);
}

export async function searchFoodsAction(
  input: FoodSearchInput
): Promise<FoodActionResult> {
  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return { error: "You must be signed in to search foods." };
  }

  const parsed = foodSearchSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid search parameters.",
    };
  }

  const supabase = await createClient();
  const search = await searchFoods(supabase, parsed.data);

  return { success: true, search };
}

export async function getFoodBySlugAction(slug: string): Promise<Food | null> {
  const parsed = foodSlugSchema.safeParse(slug);

  if (!parsed.success) {
    return null;
  }

  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return null;
  }

  const supabase = await createClient();
  return fetchFoodBySlug(supabase, parsed.data);
}

export async function getFoodSearchResult(
  input: FoodSearchInput
): Promise<FoodSearchResult> {
  const parsed = foodSearchSchema.safeParse(input);

  if (!parsed.success) {
    return {
      foods: [],
      totalCount: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    };
  }

  const supabase = await createClient();
  return searchFoods(supabase, parsed.data);
}
