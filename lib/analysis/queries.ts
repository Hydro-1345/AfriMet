import type { SupabaseClient } from "@supabase/supabase-js";
import { CONFIDENCE_THRESHOLDS } from "@/lib/ai/constants";
import type {
  MealAnalysis,
  MealAnalysisRow,
  MealComponent,
  MealComponentRow,
  NutritionRecord,
  NutritionRecordRow,
} from "@/types/analysis";

function mapComponentRow(row: MealComponentRow): MealComponent {
  return {
    id: row.id,
    mealId: row.meal_id,
    foodName: row.food_name,
    estimatedWeight: row.estimated_weight,
    confidenceScore: row.confidence_score,
    createdAt: row.created_at,
  };
}

function mapNutritionRow(row: NutritionRecordRow): NutritionRecord {
  return {
    mealId: row.meal_id,
    calories: Number(row.calories),
    protein: Number(row.protein),
    carbs: Number(row.carbs),
    fat: Number(row.fat),
    fiber: Number(row.fiber),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAnalysisRow(
  row: MealAnalysisRow,
  components: MealComponent[],
  nutrition: NutritionRecord | null
): MealAnalysis {
  return {
    id: row.id,
    mealId: row.meal_id,
    status: row.status,
    analysisNotes: row.analysis_notes,
    overallConfidence: row.overall_confidence,
    errorMessage: row.error_message,
    model: row.model,
    analyzedAt: row.analyzed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    components,
    nutrition,
  };
}

export async function fetchMealAnalysis(
  supabase: SupabaseClient,
  userId: string,
  mealId: string
): Promise<MealAnalysis | null> {
  const { data: meal, error: mealError } = await supabase
    .from("meals")
    .select("id")
    .eq("id", mealId)
    .eq("user_id", userId)
    .maybeSingle();

  if (mealError || !meal) {
    return null;
  }

  const { data: analysisRow, error: analysisError } = await supabase
    .from("meal_analyses")
    .select(
      "id, meal_id, status, analysis_notes, overall_confidence, error_message, model, analyzed_at, created_at, updated_at"
    )
    .eq("meal_id", mealId)
    .maybeSingle();

  if (analysisError || !analysisRow) {
    return null;
  }

  const [{ data: componentRows }, { data: nutritionRow }] = await Promise.all([
    supabase
      .from("meal_components")
      .select(
        "id, meal_id, food_name, estimated_weight, confidence_score, created_at"
      )
      .eq("meal_id", mealId)
      .order("food_name", { ascending: true }),
    supabase
      .from("nutrition_records")
      .select(
        "meal_id, calories, protein, carbs, fat, fiber, created_at, updated_at"
      )
      .eq("meal_id", mealId)
      .maybeSingle(),
  ]);

  return mapAnalysisRow(
    analysisRow as MealAnalysisRow,
    ((componentRows ?? []) as MealComponentRow[]).map(mapComponentRow),
    nutritionRow ? mapNutritionRow(nutritionRow as NutritionRecordRow) : null
  );
}

export function getConfidenceLevel(
  confidence: number | null
): "high" | "medium" | "low" | "unknown" {
  if (confidence === null || Number.isNaN(confidence)) {
    return "unknown";
  }

  if (confidence >= CONFIDENCE_THRESHOLDS.high) {
    return "high";
  }

  if (confidence >= CONFIDENCE_THRESHOLDS.medium) {
    return "medium";
  }

  return "low";
}

export function formatConfidencePercent(confidence: number | null): string {
  if (confidence === null || Number.isNaN(confidence)) {
    return "Unknown";
  }

  return `${Math.round(confidence * 100)}%`;
}

export function formatMacro(value: number, unit = "g"): string {
  return `${Math.round(value)} ${unit}`;
}
