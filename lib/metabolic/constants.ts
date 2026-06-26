export const METABOLIC_CALCULATION_VERSION = "sprint7_interpretive_v1" as const;

/** Technical Specification category bands — for use when an official score algorithm is added. */
export const SCORE_CATEGORY_BANDS = {
  excellent: { min: 90, max: 100, label: "Excellent" },
  good: { min: 75, max: 89, label: "Good" },
  moderate: { min: 60, max: 74, label: "Moderate" },
  needs_improvement: { min: 0, max: 59, label: "Needs Improvement" },
} as const;

export type ScoreCategory = keyof typeof SCORE_CATEGORY_BANDS;

/** Transparent glycemic impact thresholds (estimate, not clinical). */
export const GLYCEMIC_THRESHOLDS = {
  highCarbsGrams: 70,
  moderateCarbsGrams: 45,
  lowFiberGrams: 5,
  highCarbToFiberRatio: 15,
} as const;

/** Transparent satiety estimate thresholds (estimate, not clinical). */
export const SATIETY_THRESHOLDS = {
  highPoints: 35,
  moderatePoints: 20,
  fiberWeightMultiplier: 2,
} as const;

/** Transparent nutrient interpretation thresholds per meal. */
export const NUTRIENT_THRESHOLDS = {
  proteinPositiveGrams: 20,
  proteinModerateGrams: 12,
  fiberPositiveGrams: 8,
  fiberLowGrams: 5,
  carbsHighGrams: 60,
  fatHighGrams: 35,
  caloriesHighForWeightLoss: 700,
  caloriesLowForWeightGain: 400,
  diabetesCarbAttentionGrams: 45,
} as const;

export const GLYCEMIC_IMPACT_LABELS = {
  low: "Lower estimated glycemic load",
  moderate: "Moderate estimated glycemic load",
  high: "Higher estimated glycemic load",
} as const;

export const SATIETY_ESTIMATE_LABELS = {
  low: "Lower estimated satiety",
  moderate: "Moderate estimated satiety",
  high: "Higher estimated satiety",
} as const;
