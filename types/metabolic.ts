import type { ScoreCategory } from "@/lib/metabolic/constants";

export type GlycemicImpactLevel = "low" | "moderate" | "high";

export type SatietyEstimateLevel = "low" | "moderate" | "high";

export type HealthInsightType = "positive" | "improvement" | "observation";

export type HealthInsightCategory =
  | "protein"
  | "fiber"
  | "carbs"
  | "calories"
  | "fat"
  | "context"
  | "general";

export type MetabolicScore = {
  mealId: string;
  score: number | null;
  scoreCategory: ScoreCategory | null;
  glycemicImpact: GlycemicImpactLevel;
  satietyEstimate: SatietyEstimateLevel;
  healthExplanation: string;
  portionSizeGrams: number | null;
  calculationVersion: string;
  sourceNutritionUpdatedAt: string;
  sourceProfileUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type HealthInsight = {
  id: string;
  mealId: string;
  insightType: HealthInsightType;
  category: HealthInsightCategory;
  title: string;
  description: string;
  sortOrder: number;
  createdAt: string;
};

export type NutrientInterpretation = {
  label: string;
  value: string;
  assessment: string;
};

export type MetabolicAssessment = {
  score: MetabolicScore;
  insights: HealthInsight[];
  nutrientInterpretations: NutrientInterpretation[];
  scorePendingOfficialAlgorithm: boolean;
};

export type MetabolicScoreRow = {
  meal_id: string;
  score: number | null;
  score_category: ScoreCategory | null;
  glycemic_impact: GlycemicImpactLevel;
  satiety_estimate: SatietyEstimateLevel;
  health_explanation: string;
  portion_size_grams: number | null;
  calculation_version: string;
  source_nutrition_updated_at: string;
  source_profile_updated_at: string | null;
  created_at: string;
  updated_at: string;
};

export type HealthInsightRow = {
  id: string;
  meal_id: string;
  insight_type: HealthInsightType;
  category: HealthInsightCategory;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
};

export type MetabolicActionResult = {
  error?: string;
  success?: boolean;
  message?: string;
  assessment?: MetabolicAssessment;
  cached?: boolean;
};

export type MetabolicCalculationInput = {
  mealId: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    updatedAt: string;
  };
  portionSizeGrams: number | null;
  profile: {
    age: number | null;
    sex: string | null;
    activityLevel: string | null;
    weightKg: number | null;
    diabetesStatus: string | null;
    hypertensionStatus: string | null;
    goalType: string | null;
    updatedAt: string;
  } | null;
  analysisConfidence: number | null;
};

export type MetabolicCalculationResult = {
  score: number | null;
  scoreCategory: ScoreCategory | null;
  glycemicImpact: GlycemicImpactLevel;
  satietyEstimate: SatietyEstimateLevel;
  healthExplanation: string;
  insights: Array<{
    insightType: HealthInsightType;
    category: HealthInsightCategory;
    title: string;
    description: string;
    sortOrder: number;
  }>;
  nutrientInterpretations: NutrientInterpretation[];
  scorePendingOfficialAlgorithm: boolean;
};
