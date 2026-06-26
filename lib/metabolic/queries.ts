import type { SupabaseClient } from "@supabase/supabase-js";
import {
  GLYCEMIC_IMPACT_LABELS,
  SATIETY_ESTIMATE_LABELS,
  SCORE_CATEGORY_BANDS,
  type ScoreCategory,
} from "@/lib/metabolic/constants";
import type {
  HealthInsight,
  HealthInsightRow,
  MetabolicAssessment,
  MetabolicScore,
  MetabolicScoreRow,
} from "@/types/metabolic";

function mapScoreRow(row: MetabolicScoreRow): MetabolicScore {
  return {
    mealId: row.meal_id,
    score: row.score !== null ? Number(row.score) : null,
    scoreCategory: row.score_category,
    glycemicImpact: row.glycemic_impact,
    satietyEstimate: row.satiety_estimate,
    healthExplanation: row.health_explanation,
    portionSizeGrams:
      row.portion_size_grams !== null ? Number(row.portion_size_grams) : null,
    calculationVersion: row.calculation_version,
    sourceNutritionUpdatedAt: row.source_nutrition_updated_at,
    sourceProfileUpdatedAt: row.source_profile_updated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInsightRow(row: HealthInsightRow): HealthInsight {
  return {
    id: row.id,
    mealId: row.meal_id,
    insightType: row.insight_type,
    category: row.category,
    title: row.title,
    description: row.description,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export function getScoreCategoryLabel(category: ScoreCategory | null): string | null {
  if (!category) {
    return null;
  }

  return SCORE_CATEGORY_BANDS[category].label;
}

export function getGlycemicImpactLabel(
  impact: MetabolicScore["glycemicImpact"]
): string {
  return GLYCEMIC_IMPACT_LABELS[impact];
}

export function getSatietyEstimateLabel(
  estimate: MetabolicScore["satietyEstimate"]
): string {
  return SATIETY_ESTIMATE_LABELS[estimate];
}

export async function fetchMetabolicAssessment(
  supabase: SupabaseClient,
  userId: string,
  mealId: string
): Promise<MetabolicAssessment | null> {
  const { data: meal, error: mealError } = await supabase
    .from("meals")
    .select("id")
    .eq("id", mealId)
    .eq("user_id", userId)
    .maybeSingle();

  if (mealError || !meal) {
    return null;
  }

  const { data: scoreRow, error: scoreError } = await supabase
    .from("metabolic_scores")
    .select(
      "meal_id, score, score_category, glycemic_impact, satiety_estimate, health_explanation, portion_size_grams, calculation_version, source_nutrition_updated_at, source_profile_updated_at, created_at, updated_at"
    )
    .eq("meal_id", mealId)
    .maybeSingle();

  if (scoreError || !scoreRow) {
    return null;
  }

  const { data: insightRows, error: insightError } = await supabase
    .from("health_insights")
    .select(
      "id, meal_id, insight_type, category, title, description, sort_order, created_at"
    )
    .eq("meal_id", mealId)
    .order("sort_order", { ascending: true });

  if (insightError) {
    return null;
  }

  const score = mapScoreRow(scoreRow as MetabolicScoreRow);
  const insights = ((insightRows ?? []) as HealthInsightRow[]).map(mapInsightRow);

  return {
    score,
    insights,
    nutrientInterpretations: [],
    scorePendingOfficialAlgorithm: score.score === null,
  };
}

export function isMetabolicAssessmentStale(
  existing: MetabolicScore,
  nutritionUpdatedAt: string,
  profileUpdatedAt: string | null,
  calculationVersion: string
): boolean {
  if (existing.calculationVersion !== calculationVersion) {
    return true;
  }

  if (existing.sourceNutritionUpdatedAt !== nutritionUpdatedAt) {
    return true;
  }

  if (existing.sourceProfileUpdatedAt !== profileUpdatedAt) {
    return true;
  }

  return false;
}
