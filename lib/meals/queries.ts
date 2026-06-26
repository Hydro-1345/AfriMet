import type { SupabaseClient } from "@supabase/supabase-js";
import { MAX_RECENT_MEALS } from "@/lib/meals/constants";
import { getMealImageSignedUrl } from "@/lib/meals/storage";
import type { Meal, MealRow, MealSummary } from "@/types/meal";

export async function mapMealRow(
  supabase: SupabaseClient,
  row: MealRow
): Promise<Meal> {
  const imageSignedUrl = await getMealImageSignedUrl(supabase, row.image_url);

  return {
    id: row.id,
    userId: row.user_id,
    description: row.description,
    imageUrl: row.image_url,
    imageSignedUrl,
    mealDate: row.meal_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchUserMeals(
  supabase: SupabaseClient,
  userId: string
): Promise<Meal[]> {
  const { data, error } = await supabase
    .from("meals")
    .select(
      "id, user_id, description, image_url, meal_date, created_at, updated_at"
    )
    .eq("user_id", userId)
    .order("meal_date", { ascending: false });

  if (error || !data) {
    return [];
  }

  return Promise.all(data.map((row) => mapMealRow(supabase, row as MealRow)));
}

export async function fetchMealById(
  supabase: SupabaseClient,
  userId: string,
  mealId: string
): Promise<Meal | null> {
  const { data, error } = await supabase
    .from("meals")
    .select(
      "id, user_id, description, image_url, meal_date, created_at, updated_at"
    )
    .eq("id", mealId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapMealRow(supabase, data as MealRow);
}

export async function fetchMealSummary(
  supabase: SupabaseClient,
  userId: string
): Promise<MealSummary> {
  const { count, error: countError } = await supabase
    .from("meals")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    return { totalCount: 0, recentMeals: [] };
  }

  const { data, error } = await supabase
    .from("meals")
    .select(
      "id, user_id, description, image_url, meal_date, created_at, updated_at"
    )
    .eq("user_id", userId)
    .order("meal_date", { ascending: false })
    .limit(MAX_RECENT_MEALS);

  if (error || !data) {
    return { totalCount: count ?? 0, recentMeals: [] };
  }

  const recentMeals = await Promise.all(
    data.map((row) => mapMealRow(supabase, row as MealRow))
  );

  return {
    totalCount: count ?? 0,
    recentMeals,
  };
}
