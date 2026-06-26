import { NUTRIENT_THRESHOLDS } from "@/lib/metabolic/constants";
import {
  LOCAL_AFFORDABLE_FOODS,
  PROTEIN_FOODS,
  RECOMMENDATION_TYPE_LABELS,
  type RecommendationType,
} from "@/lib/recommendations/constants";
import type {
  GeneratedRecommendation,
  RecommendationGenerationInput,
} from "@/types/recommendation";

function componentNamesInclude(
  components: RecommendationGenerationInput["components"],
  keywords: string[]
): boolean {
  const names = components.map((component) => component.foodName.toLowerCase());

  return names.some((name) =>
    keywords.some((keyword) => name.includes(keyword.toLowerCase()))
  );
}

function nextSortOrder(items: GeneratedRecommendation[]): number {
  return items.length;
}

function addRecommendation(
  items: GeneratedRecommendation[],
  recommendation: Omit<GeneratedRecommendation, "sortOrder">
): void {
  items.push({ ...recommendation, sortOrder: nextSortOrder(items) });
}

export function generateMealRecommendations(
  input: RecommendationGenerationInput
): GeneratedRecommendation[] {
  const recommendations: GeneratedRecommendation[] = [];
  const { nutrition, components, metabolic, profile } = input;

  const hasRice = componentNamesInclude(components, ["rice", "jollof", "fried rice"]);
  const hasPlantain = componentNamesInclude(components, ["plantain", "dodo"]);
  const hasVegetables = componentNamesInclude(components, [
    "ewedu",
    "sukuma",
    "vegetable",
    "okra",
    "greens",
  ]);

  if (
    nutrition.carbs >= NUTRIENT_THRESHOLDS.carbsHighGrams ||
    metabolic?.glycemicImpact === "high"
  ) {
    addRecommendation(recommendations, {
      recommendationType: "portion_guidance",
      recommendationText: hasRice
        ? "Consider a slightly smaller portion of rice or swallow."
        : "Consider moderating the starchy portion of this meal.",
      explanation:
        "This meal has a higher estimated carbohydrate load based on stored nutrition analysis.",
      priority: "medium",
    });
  }

  if (nutrition.fiber < NUTRIENT_THRESHOLDS.fiberLowGrams) {
    addRecommendation(recommendations, {
      recommendationType: "fibre_improvement",
      recommendationText: "Add a fibre-rich side such as ewedu, sukuma wiki, or beans.",
      explanation: `Estimated fibre is ${Math.round(nutrition.fiber)} g, which is relatively low for one meal.`,
      priority: "medium",
    });
  }

  if (nutrition.protein < NUTRIENT_THRESHOLDS.proteinModerateGrams) {
    const suggestion = PROTEIN_FOODS.slice(0, 3).join(", ");
    addRecommendation(recommendations, {
      recommendationType: "protein_improvement",
      recommendationText: `Add a protein source such as ${suggestion}.`,
      explanation: `Estimated protein is ${Math.round(nutrition.protein)} g. More protein may improve meal balance and satiety.`,
      priority: "medium",
    });
  }

  if (!hasVegetables) {
    addRecommendation(recommendations, {
      recommendationType: "vegetable_suggestion",
      recommendationText:
        "Include a vegetable side like ewedu, sukuma wiki, or okra with your next similar meal.",
      explanation:
        "No clear vegetable component was detected. Vegetables add fibre and micronutrients.",
      priority: "low",
    });
  }

  if (hasRice && !hasVegetables) {
    addRecommendation(recommendations, {
      recommendationType: "healthier_alternative",
      recommendationText:
        "Pair rice-heavy meals with vegetables or reduce white rice in favour of beans.",
      explanation:
        "Requirements suggest healthier alternatives such as reducing white rice and increasing vegetables.",
      priority: "medium",
    });
  }

  if (hasPlantain && nutrition.fat >= NUTRIENT_THRESHOLDS.fatHighGrams) {
    addRecommendation(recommendations, {
      recommendationType: "healthier_alternative",
      recommendationText:
        "Try boiled plantain or a smaller fried plantain portion next time.",
      explanation:
        "Fried plantain increases fat and energy density compared with boiled alternatives.",
      priority: "low",
    });
  }

  if (metabolic?.glycemicImpact === "high" || metabolic?.satietyEstimate === "low") {
    addRecommendation(recommendations, {
      recommendationType: "improve_metabolic_health",
      recommendationText:
        "Balance this meal with protein, fibre, and vegetables in your next serving.",
      explanation:
        "Stored metabolic insights suggest room to improve estimated glycemic load or satiety.",
      priority: "medium",
    });
  }

  if (metabolic?.satietyEstimate === "low") {
    addRecommendation(recommendations, {
      recommendationType: "improve_satiety",
      recommendationText: "Add protein or a legume side to help you feel fuller for longer.",
      explanation:
        "The satiety estimate for this meal is lower based on protein and fibre from stored analysis.",
      priority: "medium",
    });
  }

  if (profile?.goalType === "weight_loss") {
    if (nutrition.calories >= NUTRIENT_THRESHOLDS.caloriesHighForWeightLoss) {
      addRecommendation(recommendations, {
        recommendationType: "weight_loss",
        recommendationText:
          "For your weight loss goal, try a smaller portion or swap a fried side for a vegetable.",
        explanation: `This meal is estimated at ${Math.round(nutrition.calories)} kcal, which is relatively energy-dense for one sitting.`,
        priority: "high",
      });
    } else {
      addRecommendation(recommendations, {
        recommendationType: "weight_loss",
        recommendationText:
          "Keep portions consistent and prioritise vegetables and lean protein at the next meal.",
        explanation: "Aligned with your weight loss goal from your stored profile.",
        priority: "low",
      });
    }
  }

  if (profile?.goalType === "weight_gain") {
    if (nutrition.calories <= NUTRIENT_THRESHOLDS.caloriesLowForWeightGain) {
      addRecommendation(recommendations, {
        recommendationType: "weight_gain",
        recommendationText:
          "Add an extra side such as beans, plantain, or moi moi to increase meal energy.",
        explanation: `Estimated ${Math.round(nutrition.calories)} kcal may be light relative to a weight gain goal.`,
        priority: "medium",
      });
    }
  }

  if (profile?.diabetesStatus === "yes") {
    if (
      nutrition.carbs >= NUTRIENT_THRESHOLDS.diabetesCarbAttentionGrams ||
      metabolic?.glycemicImpact !== "low"
    ) {
      addRecommendation(recommendations, {
        recommendationType: "diabetes_friendly",
        recommendationText:
          "Pair carbohydrates with protein and fibre, and keep starchy portions moderate.",
        explanation:
          "Based on your diabetes status and this meal's estimated carbohydrate level. General guidance only — not medical advice.",
        priority: "high",
      });
    }
  }

  if (profile?.hypertensionStatus === "yes") {
    addRecommendation(recommendations, {
      recommendationType: "hypertension_aware",
      recommendationText:
        "Favour home-cooked meals with vegetables and moderate portions over heavily processed options.",
      explanation:
        "General portion and whole-food awareness for hypertension context. Not medical advice.",
      priority: "medium",
    });
  }

  if (
    profile?.activityLevel === "very_active" ||
    profile?.activityLevel === "extremely_active"
  ) {
    if (nutrition.calories < 500) {
      addRecommendation(recommendations, {
        recommendationType: "activity_guidance",
        recommendationText:
          "Your activity level is high — ensure meals across the day provide enough energy.",
        explanation:
          "This meal alone is relatively light; active users often need consistent fuel across meals.",
        priority: "low",
      });
    }
  } else if (profile?.activityLevel === "sedentary") {
    if (nutrition.calories >= NUTRIENT_THRESHOLDS.caloriesHighForWeightLoss) {
      addRecommendation(recommendations, {
        recommendationType: "activity_guidance",
        recommendationText:
          "With a sedentary activity level, lighter sides or smaller portions may suit daily energy needs.",
        explanation:
          "Based on your stored activity level and this meal's estimated calorie content.",
        priority: "low",
      });
    }
  }

  const affordableSuggestion =
    input.localFoodNames.find((name) =>
      LOCAL_AFFORDABLE_FOODS.some((food) =>
        name.toLowerCase().includes(food.toLowerCase())
      )
    ) ?? LOCAL_AFFORDABLE_FOODS[0];

  if (hasRice || componentNamesInclude(components, ["cereal", "bread", "pasta"])) {
    addRecommendation(recommendations, {
      recommendationType: "reduce_cost",
      recommendationText: `Consider local staples such as beans, garri, or ${affordableSuggestion.toLowerCase()} as affordable alternatives.`,
      explanation:
        "Requirements include cost-conscious alternatives using local African foods instead of imported options.",
      priority: "low",
    });
  }

  if (recommendations.length === 0) {
    addRecommendation(recommendations, {
      recommendationType: "healthier_alternative",
      recommendationText:
        "This meal looks reasonably balanced. Keep logging meals to spot patterns over time.",
      explanation:
        "No specific improvement flags were triggered from stored nutrition and profile data.",
      priority: "low",
    });
  }

  return dedupeRecommendations(recommendations);
}

function dedupeRecommendations(
  recommendations: GeneratedRecommendation[]
): GeneratedRecommendation[] {
  const seen = new Set<string>();
  const result: GeneratedRecommendation[] = [];

  for (const item of recommendations) {
    const key = `${item.recommendationType}:${item.recommendationText}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push({ ...item, sortOrder: result.length });
  }

  return result.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
}

function priorityRank(priority: GeneratedRecommendation["priority"]): number {
  if (priority === "high") return 0;
  if (priority === "medium") return 1;
  return 2;
}

export function getRecommendationTypeLabel(type: RecommendationType): string {
  return RECOMMENDATION_TYPE_LABELS[type];
}
