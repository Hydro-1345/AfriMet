import { z } from "zod";

export const generateRecommendationsSchema = z.object({
  mealId: z.string().uuid("Invalid meal ID."),
  force: z.boolean().optional().default(false),
});

export type GenerateRecommendationsInput = z.infer<
  typeof generateRecommendationsSchema
>;
