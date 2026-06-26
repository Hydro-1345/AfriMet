import type { RecommendationType } from "@/lib/recommendations/constants";

export type RecommendationPriority = "high" | "medium" | "low";

export type Recommendation = {
  id: string;
  mealId: string;
  recommendationType: RecommendationType;
  recommendationText: string;
  explanation: string;
  priority: RecommendationPriority;
  sortOrder: number;
  calculationVersion: string;
  sourceNutritionUpdatedAt: string;
  sourceMetabolicUpdatedAt: string | null;
  sourceProfileUpdatedAt: string | null;
  createdAt: string;
};

export type RecommendationRow = {
  id: string;
  meal_id: string;
  recommendation_type: RecommendationType;
  recommendation_text: string;
  explanation: string;
  priority: RecommendationPriority;
  sort_order: number;
  calculation_version: string;
  source_nutrition_updated_at: string;
  source_metabolic_updated_at: string | null;
  source_profile_updated_at: string | null;
  created_at: string;
};

export type MealRecommendations = {
  mealId: string;
  recommendations: Recommendation[];
};

export type RecommendationActionResult = {
  error?: string;
  success?: boolean;
  message?: string;
  recommendations?: MealRecommendations;
  cached?: boolean;
};

export type GeneratedRecommendation = {
  recommendationType: RecommendationType;
  recommendationText: string;
  explanation: string;
  priority: RecommendationPriority;
  sortOrder: number;
};

export type RecommendationGenerationInput = {
  mealId: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    updatedAt: string;
  };
  components: Array<{ foodName: string; estimatedWeight: number | null }>;
  metabolic: {
    glycemicImpact: "low" | "moderate" | "high";
    satietyEstimate: "low" | "moderate" | "high";
    portionSizeGrams: number | null;
    updatedAt: string;
  } | null;
  profile: {
    activityLevel: string | null;
    diabetesStatus: string | null;
    hypertensionStatus: string | null;
    goalType: string | null;
    updatedAt: string;
  } | null;
  localFoodNames: string[];
};
