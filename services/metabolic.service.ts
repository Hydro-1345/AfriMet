"use server";

import { revalidatePath } from "next/cache";
import {
  calculateMetabolicAssessment,
  METABOLIC_CALCULATION_VERSION,
  sumPortionSizeGrams,
} from "@/lib/metabolic/calculator";
import {
  fetchMetabolicAssessment,
  isMetabolicAssessmentStale,
} from "@/lib/metabolic/queries";
import { generateMetabolicAssessmentSchema } from "@/lib/metabolic/schemas";
import { fetchMealAnalysis } from "@/lib/analysis/queries";
import { fetchUserProfile } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";
import { ensureMealRecommendations } from "@/services/recommendation.service";
import type { MetabolicActionResult, MetabolicAssessment } from "@/types/metabolic";
import type { MealComponent, NutritionRecord } from "@/types/analysis";
import type { UserProfile } from "@/types/profile";

async function requireAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

function profileToCalculationContext(profile: UserProfile | null) {
  if (!profile) {
    return null;
  }

  return {
    age: profile.age,
    sex: profile.sex,
    activityLevel: profile.activityLevel,
    weightKg: profile.weightKg,
    diabetesStatus: profile.diabetesStatus,
    hypertensionStatus: profile.hypertensionStatus,
    goalType: profile.goalType,
    updatedAt: profile.updatedAt,
  };
}

function enrichAssessment(
  assessment: MetabolicAssessment,
  nutrition: NutritionRecord,
  components: MealComponent[],
  profile: UserProfile | null,
  analysisConfidence: number | null
): MetabolicAssessment {
  const calculation = calculateMetabolicAssessment({
    mealId: assessment.score.mealId,
    nutrition: {
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      fiber: nutrition.fiber,
      updatedAt: nutrition.updatedAt,
    },
    portionSizeGrams: sumPortionSizeGrams(components),
    profile: profileToCalculationContext(profile),
    analysisConfidence,
  });

  return {
    ...assessment,
    nutrientInterpretations: calculation.nutrientInterpretations,
    scorePendingOfficialAlgorithm: calculation.scorePendingOfficialAlgorithm,
  };
}

async function persistMetabolicAssessment(
  supabase: Awaited<ReturnType<typeof createClient>>,
  mealId: string,
  calculation: ReturnType<typeof calculateMetabolicAssessment>,
  nutritionUpdatedAt: string,
  profileUpdatedAt: string | null,
  portionSizeGrams: number | null
): Promise<void> {
  await supabase.from("health_insights").delete().eq("meal_id", mealId);

  const { error: scoreError } = await supabase.from("metabolic_scores").upsert(
    {
      meal_id: mealId,
      score: calculation.score,
      score_category: calculation.scoreCategory,
      glycemic_impact: calculation.glycemicImpact,
      satiety_estimate: calculation.satietyEstimate,
      health_explanation: calculation.healthExplanation,
      portion_size_grams: portionSizeGrams,
      calculation_version: METABOLIC_CALCULATION_VERSION,
      source_nutrition_updated_at: nutritionUpdatedAt,
      source_profile_updated_at: profileUpdatedAt,
    },
    { onConflict: "meal_id" }
  );

  if (scoreError) {
    throw new Error("Unable to save metabolic assessment.");
  }

  if (calculation.insights.length > 0) {
    const { error: insightsError } = await supabase.from("health_insights").insert(
      calculation.insights.map((insight) => ({
        meal_id: mealId,
        insight_type: insight.insightType,
        category: insight.category,
        title: insight.title,
        description: insight.description,
        sort_order: insight.sortOrder,
      }))
    );

    if (insightsError) {
      throw new Error("Unable to save health insights.");
    }
  }
}

export async function ensureMetabolicAssessment(
  userId: string,
  mealId: string,
  options?: { force?: boolean }
): Promise<MetabolicActionResult> {
  const supabase = await createClient();
  const analysis = await fetchMealAnalysis(supabase, userId, mealId);

  if (!analysis || analysis.status !== "completed" || !analysis.nutrition) {
    return {
      error: "Complete meal nutrition analysis is required before metabolic insights can be generated.",
    };
  }

  const profile = await fetchUserProfile(supabase, userId);
  const profileUpdatedAt = profile?.updatedAt ?? null;
  const portionSizeGrams = sumPortionSizeGrams(analysis.components);

  const calculationInput = {
    mealId,
    nutrition: {
      calories: analysis.nutrition.calories,
      protein: analysis.nutrition.protein,
      carbs: analysis.nutrition.carbs,
      fat: analysis.nutrition.fat,
      fiber: analysis.nutrition.fiber,
      updatedAt: analysis.nutrition.updatedAt,
    },
    portionSizeGrams,
    profile: profileToCalculationContext(profile),
    analysisConfidence: analysis.overallConfidence,
  };

  if (!options?.force) {
    const existing = await fetchMetabolicAssessment(supabase, userId, mealId);

    if (
      existing &&
      !isMetabolicAssessmentStale(
        existing.score,
        analysis.nutrition.updatedAt,
        profileUpdatedAt,
        METABOLIC_CALCULATION_VERSION
      )
    ) {
      return {
        success: true,
        cached: true,
        assessment: enrichAssessment(
          existing,
          analysis.nutrition,
          analysis.components,
          profile,
          analysis.overallConfidence
        ),
      };
    }
  }

  const calculation = calculateMetabolicAssessment(calculationInput);

  try {
    await persistMetabolicAssessment(
      supabase,
      mealId,
      calculation,
      analysis.nutrition.updatedAt,
      profileUpdatedAt,
      portionSizeGrams
    );
  } catch (error) {
    console.error("[metabolic] Failed to persist assessment:", error);
    return { error: "Unable to generate metabolic insights. Please try again." };
  }

  const assessment = await fetchMetabolicAssessment(supabase, userId, mealId);

  if (!assessment) {
    return { error: "Unable to load metabolic insights. Please try again." };
  }

  await ensureMealRecommendations(userId, mealId, { force: options?.force });

  return {
    success: true,
    message: "Metabolic insights generated.",
    assessment: enrichAssessment(
      assessment,
      analysis.nutrition,
      analysis.components,
      profile,
      analysis.overallConfidence
    ),
  };
}

export async function generateMetabolicAssessmentAction(
  input: { mealId: string; force?: boolean }
): Promise<MetabolicActionResult> {
  const parsed = generateMetabolicAssessmentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid request.",
    };
  }

  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return { error: "You must be signed in to generate metabolic insights." };
  }

  const result = await ensureMetabolicAssessment(userId, parsed.data.mealId, {
    force: parsed.data.force,
  });

  if (result.success && !result.cached) {
    revalidatePath(`/meals/${parsed.data.mealId}/analysis`);
    revalidatePath(`/meals/${parsed.data.mealId}`);
  }

  return result;
}

export async function getMetabolicAssessmentForMeal(
  userId: string,
  mealId: string
): Promise<MetabolicAssessment | null> {
  const supabase = await createClient();
  const [assessment, analysis, profile] = await Promise.all([
    fetchMetabolicAssessment(supabase, userId, mealId),
    fetchMealAnalysis(supabase, userId, mealId),
    fetchUserProfile(supabase, userId),
  ]);

  if (!assessment || !analysis?.nutrition) {
    return null;
  }

  return enrichAssessment(
    assessment,
    analysis.nutrition,
    analysis.components,
    profile,
    analysis.overallConfidence
  );
}
