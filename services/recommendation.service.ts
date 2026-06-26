"use server";

import { revalidatePath } from "next/cache";
import { fetchMealAnalysis } from "@/lib/analysis/queries";
import { searchFoods } from "@/lib/foods/queries";
import { fetchMetabolicAssessment } from "@/lib/metabolic/queries";
import { generateMealRecommendations } from "@/lib/recommendations/generator";
import {
  fetchMealRecommendations,
  isRecommendationsStale,
} from "@/lib/recommendations/queries";
import { generateRecommendationsSchema } from "@/lib/recommendations/schemas";
import { RECOMMENDATION_CALCULATION_VERSION } from "@/lib/recommendations/constants";
import { fetchUserProfile } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";
import type { RecommendationActionResult } from "@/types/recommendation";
import type { UserProfile } from "@/types/profile";

async function requireAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

function profileToContext(profile: UserProfile | null) {
  if (!profile) {
    return null;
  }

  return {
    activityLevel: profile.activityLevel,
    diabetesStatus: profile.diabetesStatus,
    hypertensionStatus: profile.hypertensionStatus,
    goalType: profile.goalType,
    updatedAt: profile.updatedAt,
  };
}

async function fetchLocalFoodNames(
  supabase: Awaited<ReturnType<typeof createClient>>,
  components: Array<{ foodName: string }>
): Promise<string[]> {
  const queries = components
    .map((component) => component.foodName.split(" ")[0])
    .filter(Boolean)
    .slice(0, 3);

  const results = await Promise.all(
    queries.map((query) =>
      searchFoods(supabase, { query, page: 1, pageSize: 5 })
    )
  );

  const names = new Set<string>();
  for (const result of results) {
    for (const food of result.foods) {
      names.add(food.name);
    }
  }

  return Array.from(names);
}

export async function ensureMealRecommendations(
  userId: string,
  mealId: string,
  options?: { force?: boolean }
): Promise<RecommendationActionResult> {
  const supabase = await createClient();
  const [analysis, metabolicRow, profile] = await Promise.all([
    fetchMealAnalysis(supabase, userId, mealId),
    fetchMetabolicAssessment(supabase, userId, mealId),
    fetchUserProfile(supabase, userId),
  ]);

  if (!analysis || analysis.status !== "completed" || !analysis.nutrition) {
    return {
      error:
        "Complete meal nutrition analysis is required before recommendations can be generated.",
    };
  }

  if (!metabolicRow) {
    return {
      error:
        "Metabolic insights are required before recommendations can be generated.",
    };
  }

  const profileUpdatedAt = profile?.updatedAt ?? null;
  const metabolicUpdatedAt = metabolicRow.score.updatedAt;
  const nutritionUpdatedAt = analysis.nutrition.updatedAt;

  if (!options?.force) {
    const existing = await fetchMealRecommendations(supabase, userId, mealId);

    if (
      existing &&
      !isRecommendationsStale(
        existing.recommendations,
        nutritionUpdatedAt,
        metabolicUpdatedAt,
        profileUpdatedAt
      )
    ) {
      return {
        success: true,
        cached: true,
        recommendations: existing,
      };
    }
  }

  const localFoodNames = await fetchLocalFoodNames(supabase, analysis.components);

  const generated = generateMealRecommendations({
    mealId,
    nutrition: {
      calories: analysis.nutrition.calories,
      protein: analysis.nutrition.protein,
      carbs: analysis.nutrition.carbs,
      fat: analysis.nutrition.fat,
      fiber: analysis.nutrition.fiber,
      updatedAt: analysis.nutrition.updatedAt,
    },
    components: analysis.components.map((component) => ({
      foodName: component.foodName,
      estimatedWeight: component.estimatedWeight,
    })),
    metabolic: {
      glycemicImpact: metabolicRow.score.glycemicImpact,
      satietyEstimate: metabolicRow.score.satietyEstimate,
      portionSizeGrams: metabolicRow.score.portionSizeGrams,
      updatedAt: metabolicRow.score.updatedAt,
    },
    profile: profileToContext(profile),
    localFoodNames,
  });

  await supabase.from("recommendations").delete().eq("meal_id", mealId);

  const { error: insertError } = await supabase.from("recommendations").insert(
    generated.map((item) => ({
      meal_id: mealId,
      recommendation_type: item.recommendationType,
      recommendation_text: item.recommendationText,
      explanation: item.explanation,
      priority: item.priority,
      sort_order: item.sortOrder,
      calculation_version: RECOMMENDATION_CALCULATION_VERSION,
      source_nutrition_updated_at: nutritionUpdatedAt,
      source_metabolic_updated_at: metabolicUpdatedAt,
      source_profile_updated_at: profileUpdatedAt,
    }))
  );

  if (insertError) {
    console.error("[recommendations] Failed to save recommendations:", insertError);
    return { error: "Unable to generate recommendations. Please try again." };
  }

  const recommendations = await fetchMealRecommendations(supabase, userId, mealId);

  return {
    success: true,
    message: "Recommendations generated.",
    recommendations: recommendations ?? undefined,
  };
}

export async function generateRecommendationsAction(
  input: { mealId: string; force?: boolean }
): Promise<RecommendationActionResult> {
  const parsed = generateRecommendationsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid request.",
    };
  }

  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return { error: "You must be signed in to view recommendations." };
  }

  const result = await ensureMealRecommendations(userId, parsed.data.mealId, {
    force: parsed.data.force,
  });

  if (result.success && !result.cached) {
    revalidatePath(`/meals/${parsed.data.mealId}/analysis`);
    revalidatePath(`/meals/${parsed.data.mealId}`);
  }

  return result;
}

export async function getMealRecommendationsForMeal(
  userId: string,
  mealId: string
): Promise<RecommendationActionResult["recommendations"] | null> {
  const supabase = await createClient();
  return fetchMealRecommendations(supabase, userId, mealId);
}
