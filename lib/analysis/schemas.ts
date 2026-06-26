import { z } from "zod";

const macroValue = z
  .number()
  .min(0, "Nutrition values cannot be negative.")
  .max(10_000, "Nutrition value is unrealistically high.");

const confidenceValue = z
  .number()
  .min(0, "Confidence must be between 0 and 1.")
  .max(1, "Confidence must be between 0 and 1.");

export const aiMealComponentSchema = z.object({
  food_name: z.string().min(1).max(120),
  estimated_weight_grams: z.union([z.number().positive().max(5_000), z.null()]),
  confidence_score: z.union([confidenceValue, z.null()]),
});

export const aiNutritionSchema = z.object({
  calories: macroValue,
  protein: macroValue,
  carbs: macroValue,
  fat: macroValue,
  fiber: macroValue,
});

export const aiMealAnalysisResponseSchema = z.object({
  components: z.array(aiMealComponentSchema).min(1).max(20),
  nutrition: aiNutritionSchema,
  overall_confidence: confidenceValue,
  analysis_notes: z.string().min(1).max(2000),
});

export type AiMealAnalysisResponse = z.infer<typeof aiMealAnalysisResponseSchema>;

export const analyzeMealInputSchema = z.object({
  mealId: z.string().uuid("Invalid meal ID."),
  force: z.boolean().optional().default(false),
});

export type AnalyzeMealInput = z.infer<typeof analyzeMealInputSchema>;
