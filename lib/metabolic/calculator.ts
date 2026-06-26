import {
  GLYCEMIC_THRESHOLDS,
  METABOLIC_CALCULATION_VERSION,
  NUTRIENT_THRESHOLDS,
  SATIETY_THRESHOLDS,
  SCORE_CATEGORY_BANDS,
  type ScoreCategory,
} from "@/lib/metabolic/constants";
import type {
  GlycemicImpactLevel,
  MetabolicCalculationInput,
  MetabolicCalculationResult,
  NutrientInterpretation,
  SatietyEstimateLevel,
} from "@/types/metabolic";
import type { MealComponent } from "@/types/analysis";

export function getScoreCategoryFromScore(score: number): ScoreCategory {
  if (score >= SCORE_CATEGORY_BANDS.excellent.min) {
    return "excellent";
  }

  if (score >= SCORE_CATEGORY_BANDS.good.min) {
    return "good";
  }

  if (score >= SCORE_CATEGORY_BANDS.moderate.min) {
    return "moderate";
  }

  return "needs_improvement";
}

/**
 * Official 0–100 metabolic score algorithm is not defined in project documentation.
 * Returns null until an approved algorithm is implemented.
 */
export function calculateOfficialMetabolicScore(): {
  score: null;
  scoreCategory: null;
} {
  return { score: null, scoreCategory: null };
}

export function estimateGlycemicImpact(
  carbs: number,
  fiber: number
): GlycemicImpactLevel {
  const safeFiber = Math.max(fiber, 1);
  const carbToFiberRatio = carbs / safeFiber;

  if (
    carbs >= GLYCEMIC_THRESHOLDS.highCarbsGrams &&
    fiber <= GLYCEMIC_THRESHOLDS.lowFiberGrams
  ) {
    return "high";
  }

  if (
    carbs >= GLYCEMIC_THRESHOLDS.moderateCarbsGrams ||
    carbToFiberRatio >= GLYCEMIC_THRESHOLDS.highCarbToFiberRatio
  ) {
    return "moderate";
  }

  return "low";
}

export function estimateSatiety(protein: number, fiber: number): SatietyEstimateLevel {
  const points =
    protein + fiber * SATIETY_THRESHOLDS.fiberWeightMultiplier;

  if (points >= SATIETY_THRESHOLDS.highPoints) {
    return "high";
  }

  if (points >= SATIETY_THRESHOLDS.moderatePoints) {
    return "moderate";
  }

  return "low";
}

export function sumPortionSizeGrams(components: MealComponent[]): number | null {
  const weights = components
    .map((component) => component.estimatedWeight)
    .filter((weight): weight is number => weight !== null && weight > 0);

  if (weights.length === 0) {
    return null;
  }

  return weights.reduce((total, weight) => total + weight, 0);
}

function buildNutrientInterpretations(
  input: MetabolicCalculationInput
): NutrientInterpretation[] {
  const { calories, protein, carbs, fat, fiber } = input.nutrition;

  const proteinAssessment =
    protein >= NUTRIENT_THRESHOLDS.proteinPositiveGrams
      ? "Strong protein content for a single meal."
      : protein >= NUTRIENT_THRESHOLDS.proteinModerateGrams
        ? "Moderate protein content."
        : "Protein is on the lower side for this meal.";

  const fiberAssessment =
    fiber >= NUTRIENT_THRESHOLDS.fiberPositiveGrams
      ? "Good fiber contribution."
      : fiber >= NUTRIENT_THRESHOLDS.fiberLowGrams
        ? "Some fiber present, but could be higher."
        : "Low fiber for this meal.";

  const carbsAssessment =
    carbs >= NUTRIENT_THRESHOLDS.carbsHighGrams
      ? "Higher carbohydrate load."
      : "Carbohydrate load appears moderate for one meal.";

  const fatAssessment =
    fat >= NUTRIENT_THRESHOLDS.fatHighGrams
      ? "Higher fat content."
      : "Fat content appears moderate.";

  return [
    {
      label: "Calories",
      value: `${Math.round(calories)} kcal`,
      assessment: "Estimated energy from AI nutrition analysis.",
    },
    {
      label: "Protein",
      value: `${Math.round(protein)} g`,
      assessment: proteinAssessment,
    },
    {
      label: "Carbohydrates",
      value: `${Math.round(carbs)} g`,
      assessment: carbsAssessment,
    },
    {
      label: "Fat",
      value: `${Math.round(fat)} g`,
      assessment: fatAssessment,
    },
    {
      label: "Fibre",
      value: `${Math.round(fiber)} g`,
      assessment: fiberAssessment,
    },
  ];
}

function buildHealthInsights(input: MetabolicCalculationInput): MetabolicCalculationResult["insights"] {
  const insights: MetabolicCalculationResult["insights"] = [];
  let sortOrder = 0;
  const { calories, protein, carbs, fiber, fat } = input.nutrition;
  const profile = input.profile;

  if (protein >= NUTRIENT_THRESHOLDS.proteinPositiveGrams) {
    insights.push({
      insightType: "positive",
      category: "protein",
      title: "Good protein content",
      description:
        "This meal provides a solid amount of protein, which supports satiety and muscle maintenance.",
      sortOrder: sortOrder++,
    });
  } else if (protein < NUTRIENT_THRESHOLDS.proteinModerateGrams) {
    insights.push({
      insightType: "improvement",
      category: "protein",
      title: "Protein could be higher",
      description:
        "Adding a protein source such as fish, lean meat, beans, or eggs may improve meal balance.",
      sortOrder: sortOrder++,
    });
  }

  if (fiber >= NUTRIENT_THRESHOLDS.fiberPositiveGrams) {
    insights.push({
      insightType: "positive",
      category: "fiber",
      title: "Helpful fibre content",
      description:
        "Fibre supports digestion and can moderate the impact of carbohydrates in a meal.",
      sortOrder: sortOrder++,
    });
  } else if (fiber < NUTRIENT_THRESHOLDS.fiberLowGrams) {
    insights.push({
      insightType: "improvement",
      category: "fiber",
      title: "Low fibre intake",
      description:
        "Consider adding vegetables, legumes, or other fibre-rich African sides to improve balance.",
      sortOrder: sortOrder++,
    });
  }

  if (carbs >= NUTRIENT_THRESHOLDS.carbsHighGrams) {
    insights.push({
      insightType: "observation",
      category: "carbs",
      title: "Higher carbohydrate load",
      description:
        "This meal is carbohydrate-heavy. Portion awareness may be useful depending on your goals.",
      sortOrder: sortOrder++,
    });
  }

  if (fat >= NUTRIENT_THRESHOLDS.fatHighGrams) {
    insights.push({
      insightType: "observation",
      category: "fat",
      title: "Higher fat content",
      description:
        "Fat contributes significant energy in this meal. Balance across the day may help overall intake.",
      sortOrder: sortOrder++,
    });
  }

  if (profile?.diabetesStatus === "yes" && carbs >= NUTRIENT_THRESHOLDS.diabetesCarbAttentionGrams) {
    insights.push({
      insightType: "observation",
      category: "context",
      title: "Carbohydrate awareness",
      description:
        "Based on your diabetes status, this meal's carbohydrate level is worth noting. This is general guidance, not medical advice.",
      sortOrder: sortOrder++,
    });
  }

  if (profile?.goalType === "weight_loss" && calories >= NUTRIENT_THRESHOLDS.caloriesHighForWeightLoss) {
    insights.push({
      insightType: "observation",
      category: "context",
      title: "Calorie-dense for weight loss goals",
      description:
        "This meal is relatively energy-dense. Smaller portions or lighter sides may align better with a weight loss goal.",
      sortOrder: sortOrder++,
    });
  }

  if (profile?.goalType === "weight_gain" && calories <= NUTRIENT_THRESHOLDS.caloriesLowForWeightGain) {
    insights.push({
      insightType: "improvement",
      category: "context",
      title: "Room for more energy",
      description:
        "For a weight gain goal, this meal is relatively light. An additional side or protein portion may help.",
      sortOrder: sortOrder++,
    });
  }

  if (profile?.activityLevel === "very_active" || profile?.activityLevel === "extremely_active") {
    insights.push({
      insightType: "observation",
      category: "context",
      title: "Active lifestyle context",
      description:
        "Your activity level is high. Carbohydrate and calorie needs may be higher than average across the day.",
      sortOrder: sortOrder++,
    });
  }

  if (insights.length === 0) {
    insights.push({
      insightType: "observation",
      category: "general",
      title: "Balanced meal profile",
      description:
        "No major nutrient flags were identified from this analysis. Continue tracking meals for patterns over time.",
      sortOrder: sortOrder++,
    });
  }

  return insights;
}

function buildHealthExplanation(
  glycemicImpact: GlycemicImpactLevel,
  satietyEstimate: SatietyEstimateLevel,
  input: MetabolicCalculationInput
): string {
  const glycemicText =
    glycemicImpact === "high"
      ? "carbohydrate content suggests a higher estimated glycemic load"
      : glycemicImpact === "moderate"
        ? "carbohydrate and fibre balance suggests a moderate estimated glycemic load"
        : "carbohydrate and fibre balance suggests a lower estimated glycemic load";

  const satietyText =
    satietyEstimate === "high"
      ? "protein and fibre may support stronger satiety"
      : satietyEstimate === "moderate"
        ? "protein and fibre may provide moderate satiety"
        : "protein and fibre may provide limited satiety";

  const portionText =
    input.portionSizeGrams !== null
      ? ` Estimated total portion size is about ${Math.round(input.portionSizeGrams)} g.`
      : "";

  const confidenceText =
    input.analysisConfidence !== null
      ? ` Analysis confidence: ${Math.round(input.analysisConfidence * 100)}%.`
      : "";

  return `Based on the stored nutrition analysis, this meal's ${glycemicText}, and ${satietyText}.${portionText}${confidenceText} These are interpretive estimates, not clinical assessments. An official 0–100 metabolic score will be added when the approved algorithm is defined.`;
}

export function calculateMetabolicAssessment(
  input: MetabolicCalculationInput
): MetabolicCalculationResult {
  const { score, scoreCategory } = calculateOfficialMetabolicScore();
  const glycemicImpact = estimateGlycemicImpact(
    input.nutrition.carbs,
    input.nutrition.fiber
  );
  const satietyEstimate = estimateSatiety(
    input.nutrition.protein,
    input.nutrition.fiber
  );
  const nutrientInterpretations = buildNutrientInterpretations(input);
  const insights = buildHealthInsights(input);
  const healthExplanation = buildHealthExplanation(
    glycemicImpact,
    satietyEstimate,
    input
  );

  return {
    score,
    scoreCategory,
    glycemicImpact,
    satietyEstimate,
    healthExplanation,
    insights,
    nutrientInterpretations,
    scorePendingOfficialAlgorithm: true,
  };
}

export { METABOLIC_CALCULATION_VERSION };
