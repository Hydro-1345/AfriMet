import type { SupabaseClient } from "@supabase/supabase-js";
import { RECOMMENDATION_CALCULATION_VERSION } from "@/lib/recommendations/constants";
import type {
  MealRecommendations,
  Recommendation,
  RecommendationRow,
} from "@/types/recommendation";

function mapRecommendationRow(row: RecommendationRow): Recommendation {
  return {
    id: row.id,
    mealId: row.meal_id,
    recommendationType: row.recommendation_type,
    recommendationText: row.recommendation_text,
    explanation: row.explanation,
    priority: row.priority,
    sortOrder: row.sort_order,
    calculationVersion: row.calculation_version,
    sourceNutritionUpdatedAt: row.source_nutrition_updated_at,
    sourceMetabolicUpdatedAt: row.source_metabolic_updated_at,
    sourceProfileUpdatedAt: row.source_profile_updated_at,
    createdAt: row.created_at,
  };
}

export async function fetchMealRecommendations(
  supabase: SupabaseClient,
  userId: string,
  mealId: string
): Promise<MealRecommendations | null> {
  const { data: meal, error: mealError } = await supabase
    .from("meals")
    .select("id")
    .eq("id", mealId)
    .eq("user_id", userId)
    .maybeSingle();

  if (mealError || !meal) {
    return null;
  }

  const { data, error } = await supabase
    .from("recommendations")
    .select(
      "id, meal_id, recommendation_type, recommendation_text, explanation, priority, sort_order, calculation_version, source_nutrition_updated_at, source_metabolic_updated_at, source_profile_updated_at, created_at"
    )
    .eq("meal_id", mealId)
    .order("sort_order", { ascending: true });

  if (error) {
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return {
    mealId,
    recommendations: (data as RecommendationRow[]).map(mapRecommendationRow),
  };
}

export function isRecommendationsStale(
  existing: Recommendation[],
  nutritionUpdatedAt: string,
  metabolicUpdatedAt: string | null,
  profileUpdatedAt: string | null
): boolean {
  const first = existing[0];
  if (!first) {
    return true;
  }

  if (first.calculationVersion !== RECOMMENDATION_CALCULATION_VERSION) {
    return true;
  }

  if (first.sourceNutritionUpdatedAt !== nutritionUpdatedAt) {
    return true;
  }

  if (first.sourceMetabolicUpdatedAt !== metabolicUpdatedAt) {
    return true;
  }

  if (first.sourceProfileUpdatedAt !== profileUpdatedAt) {
    return true;
  }

  return false;
}
