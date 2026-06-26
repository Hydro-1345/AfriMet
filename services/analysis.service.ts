"use server";

import { revalidatePath } from "next/cache";
import { runMealAnalysis } from "@/lib/ai/meal-analysis/analyze";
import { fetchMealAnalysis } from "@/lib/analysis/queries";
import { analyzeMealInputSchema } from "@/lib/analysis/schemas";
import { fetchMealById } from "@/lib/meals/queries";
import { createClient } from "@/lib/supabase/server";
import { ensureMetabolicAssessment } from "@/services/metabolic.service";
import type { AnalysisActionResult } from "@/types/analysis";

async function requireAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

async function clearMealAnalysisData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  mealId: string
): Promise<void> {
  await Promise.all([
    supabase.from("meal_components").delete().eq("meal_id", mealId),
    supabase.from("nutrition_records").delete().eq("meal_id", mealId),
    supabase.from("meal_analyses").delete().eq("meal_id", mealId),
  ]);
}

async function persistFailedAnalysis(
  supabase: Awaited<ReturnType<typeof createClient>>,
  mealId: string,
  errorMessage: string
): Promise<void> {
  await clearMealAnalysisData(supabase, mealId);

  await supabase.from("meal_analyses").insert({
    meal_id: mealId,
    status: "failed",
    error_message: errorMessage,
    analyzed_at: new Date().toISOString(),
  });
}

export async function getMealAnalysisAction(
  mealId: string
): Promise<AnalysisActionResult> {
  const parsed = analyzeMealInputSchema.pick({ mealId: true }).safeParse({ mealId });

  if (!parsed.success) {
    return { error: "Invalid meal ID." };
  }

  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return { error: "You must be signed in to view meal analysis." };
  }

  const supabase = await createClient();
  const analysis = await fetchMealAnalysis(supabase, userId, parsed.data.mealId);

  if (!analysis) {
    return { success: true, message: "No analysis available yet." };
  }

  return { success: true, analysis };
}

export async function analyzeMealAction(
  input: { mealId: string; force?: boolean }
): Promise<AnalysisActionResult> {
  const parsed = analyzeMealInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid analysis request.",
    };
  }

  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return { error: "You must be signed in to analyze meals." };
  }

  const supabase = await createClient();
  const meal = await fetchMealById(supabase, userId, parsed.data.mealId);

  if (!meal) {
    return { error: "Meal not found." };
  }

  if (!parsed.data.force) {
    const existing = await fetchMealAnalysis(supabase, userId, parsed.data.mealId);

    if (existing?.status === "completed") {
      return {
        success: true,
        cached: true,
        message: "Using existing meal analysis.",
        analysis: existing,
      };
    }
  }

  const result = await runMealAnalysis(supabase, meal);

  if (!result.success) {
    await persistFailedAnalysis(supabase, parsed.data.mealId, result.error);
    revalidatePath(`/meals/${parsed.data.mealId}/analysis`);

    return { error: result.error };
  }

  await clearMealAnalysisData(supabase, parsed.data.mealId);

  const analyzedAt = new Date().toISOString();

  const { error: analysisError } = await supabase.from("meal_analyses").insert({
    meal_id: parsed.data.mealId,
    status: "completed",
    analysis_notes: result.data.analysis_notes,
    overall_confidence: result.data.overall_confidence,
    model: result.model,
    analyzed_at: analyzedAt,
  });

  if (analysisError) {
    console.error("[meal-analysis] Failed to save analysis metadata:", analysisError);
    return { error: "Unable to save meal analysis. Please try again." };
  }

  const componentRows = result.data.components.map((component) => ({
    meal_id: parsed.data.mealId,
    food_name: component.food_name,
    estimated_weight: component.estimated_weight_grams ?? null,
    confidence_score: component.confidence_score ?? null,
  }));

  const { error: componentsError } = await supabase
    .from("meal_components")
    .insert(componentRows);

  if (componentsError) {
    console.error("[meal-analysis] Failed to save meal components:", componentsError);
    await persistFailedAnalysis(
      supabase,
      parsed.data.mealId,
      "Unable to save detected foods."
    );
    return { error: "Unable to save detected foods. Please try again." };
  }

  const { error: nutritionError } = await supabase.from("nutrition_records").insert({
    meal_id: parsed.data.mealId,
    calories: result.data.nutrition.calories,
    protein: result.data.nutrition.protein,
    carbs: result.data.nutrition.carbs,
    fat: result.data.nutrition.fat,
    fiber: result.data.nutrition.fiber,
  });

  if (nutritionError) {
    console.error("[meal-analysis] Failed to save nutrition record:", nutritionError);
    await persistFailedAnalysis(
      supabase,
      parsed.data.mealId,
      "Unable to save nutrition estimates."
    );
    return { error: "Unable to save nutrition estimates. Please try again." };
  }

  const analysis = await fetchMealAnalysis(supabase, userId, parsed.data.mealId);

  revalidatePath(`/meals/${parsed.data.mealId}`);
  revalidatePath(`/meals/${parsed.data.mealId}/analysis`);
  revalidatePath("/meals");
  revalidatePath("/dashboard");

  if (analysis?.status === "completed" && analysis.nutrition) {
    await ensureMetabolicAssessment(userId, parsed.data.mealId, { force: true });
  }

  return {
    success: true,
    message: "Meal analyzed successfully.",
    analysis: analysis ?? undefined,
  };
}
