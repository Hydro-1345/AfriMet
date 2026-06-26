export const RECOMMENDATION_CALCULATION_VERSION = "sprint8_deterministic_v1" as const;

export const RECOMMENDATION_TYPES = [
  "improve_metabolic_health",
  "improve_satiety",
  "reduce_cost",
  "weight_loss",
  "weight_gain",
  "diabetes_friendly",
  "healthier_alternative",
  "portion_guidance",
  "fibre_improvement",
  "protein_improvement",
  "vegetable_suggestion",
  "hypertension_aware",
  "activity_guidance",
] as const;

export type RecommendationType = (typeof RECOMMENDATION_TYPES)[number];

export const RECOMMENDATION_TYPE_LABELS: Record<RecommendationType, string> = {
  improve_metabolic_health: "Improve metabolic health",
  improve_satiety: "Improve satiety",
  reduce_cost: "Reduce cost",
  weight_loss: "Weight loss",
  weight_gain: "Weight gain",
  diabetes_friendly: "Diabetes-friendly",
  healthier_alternative: "Healthier alternative",
  portion_guidance: "Portion guidance",
  fibre_improvement: "Fibre improvement",
  protein_improvement: "Protein improvement",
  vegetable_suggestion: "Vegetable suggestion",
  hypertension_aware: "Hypertension-aware",
  activity_guidance: "Activity guidance",
};

export const RECOMMENDATION_PRIORITY_LABELS = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
} as const;

export const LOCAL_AFFORDABLE_FOODS = [
  "Beans",
  "Garri",
  "Moi Moi",
  "Sukuma Wiki",
  "Ewedu",
  "Boiled Plantain",
] as const;

export const VEGETABLE_FOODS = [
  "Ewedu",
  "Sukuma Wiki",
  "Ewedu",
  "Okra",
  "Vegetable",
] as const;

export const PROTEIN_FOODS = [
  "Beans",
  "Moi Moi",
  "Suya",
  "Goat Meat Stew",
  "Fried Fish",
  "Nyama Choma",
  "Akara",
] as const;
