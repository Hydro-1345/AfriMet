import { z } from "zod";

export const generateMetabolicAssessmentSchema = z.object({
  mealId: z.string().uuid("Invalid meal ID."),
  force: z.boolean().optional().default(false),
});

export type GenerateMetabolicAssessmentInput = z.infer<
  typeof generateMetabolicAssessmentSchema
>;
