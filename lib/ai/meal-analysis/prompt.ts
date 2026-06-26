import type { Food } from "@/types/food";

export function buildMealAnalysisSystemPrompt(): string {
  return `You are AfriMet's culturally-aware meal analysis assistant for African and diaspora populations.

Your task is to estimate detected foods, serving sizes, and nutrition from a meal description and/or meal photo.

Rules:
- Prioritize African dishes, local names, and diaspora meal patterns.
- Recognize aliases (e.g. dodo = fried plantain, iyan = pounded yam, posho = ugali).
- Estimate reasonable portion sizes in grams when possible.
- Provide conservative nutrition estimates when uncertain.
- Explain uncertainty clearly in analysis_notes.
- Never invent ingredients that are not reasonably supported by the input.
- Never return free-form prose outside the required JSON schema.
- Return valid JSON only.`;
}

export function buildMealAnalysisUserText(
  description: string,
  foodContext: Food[]
): string {
  const foodHints =
    foodContext.length > 0
      ? foodContext
          .map((food) => {
            const aliases =
              food.aliases.length > 0 ? ` (aliases: ${food.aliases.join(", ")})` : "";
            return `- ${food.name}${aliases}`;
          })
          .join("\n")
      : "No specific food library matches were provided.";

  return `Analyze this meal and return structured JSON.

Meal description:
${description.trim()}

Relevant African food library hints:
${foodHints}

Return JSON with:
- components: array of { food_name, estimated_weight_grams, confidence_score }
- nutrition: { calories, protein, carbs, fat, fiber } in grams except calories in kcal
- overall_confidence: number from 0 to 1
- analysis_notes: brief explanation of estimates and uncertainty`;
}

export function getMealAnalysisJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "components",
      "nutrition",
      "overall_confidence",
      "analysis_notes",
    ],
    properties: {
      components: {
        type: "array",
        minItems: 1,
        maxItems: 20,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["food_name", "estimated_weight_grams", "confidence_score"],
          properties: {
            food_name: { type: "string" },
            estimated_weight_grams: { type: ["number", "null"] },
            confidence_score: { type: ["number", "null"] },
          },
        },
      },
      nutrition: {
        type: "object",
        additionalProperties: false,
        required: ["calories", "protein", "carbs", "fat", "fiber"],
        properties: {
          calories: { type: "number" },
          protein: { type: "number" },
          carbs: { type: "number" },
          fat: { type: "number" },
          fiber: { type: "number" },
        },
      },
      overall_confidence: { type: "number" },
      analysis_notes: { type: "string" },
    },
  } as const;
}
