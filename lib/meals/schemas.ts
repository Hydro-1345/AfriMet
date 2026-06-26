import { z } from "zod";

const MAX_FUTURE_MS = 24 * 60 * 60 * 1000;
const MAX_PAST_MS = 365 * 24 * 60 * 60 * 1000;

function parseMealDate(value: string): Date | null {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export const mealSchema = z.object({
  description: z
    .string()
    .min(1, "Describe your meal.")
    .max(2000, "Description must be 2000 characters or fewer."),
  mealDate: z
    .string()
    .min(1, "Meal date and time are required.")
    .refine((value) => parseMealDate(value) !== null, {
      message: "Enter a valid date and time.",
    })
    .refine((value) => {
      const date = parseMealDate(value);
      if (!date) return false;
      return date.getTime() <= Date.now() + MAX_FUTURE_MS;
    }, {
      message: "Meal date cannot be more than 24 hours in the future.",
    })
    .refine((value) => {
      const date = parseMealDate(value);
      if (!date) return false;
      return date.getTime() >= Date.now() - MAX_PAST_MS;
    }, {
      message: "Meal date cannot be more than one year in the past.",
    }),
  removeImage: z.boolean().optional(),
});

export type MealFormInput = z.input<typeof mealSchema>;
export type MealInput = z.output<typeof mealSchema>;
