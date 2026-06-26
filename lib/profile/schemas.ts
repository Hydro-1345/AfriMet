import { z } from "zod";
import {
  ACTIVITY_LEVELS,
  GOAL_OPTIONS,
  HEALTH_STATUS_OPTIONS,
  SEX_OPTIONS,
} from "@/lib/profile/constants";

const sexValues = SEX_OPTIONS.map((option) => option.value) as [
  (typeof SEX_OPTIONS)[number]["value"],
  ...(typeof SEX_OPTIONS)[number]["value"][],
];

const activityValues = ACTIVITY_LEVELS.map((option) => option.value) as [
  (typeof ACTIVITY_LEVELS)[number]["value"],
  ...(typeof ACTIVITY_LEVELS)[number]["value"][],
];

const healthStatusValues = HEALTH_STATUS_OPTIONS.map((option) => option.value) as [
  (typeof HEALTH_STATUS_OPTIONS)[number]["value"],
  ...(typeof HEALTH_STATUS_OPTIONS)[number]["value"][],
];

const goalValues = GOAL_OPTIONS.map((option) => option.value) as [
  (typeof GOAL_OPTIONS)[number]["value"],
  ...(typeof GOAL_OPTIONS)[number]["value"][],
];

const optionalHealthStatusSchema = z
  .union([z.enum(healthStatusValues), z.literal("")])
  .transform((value) => (value === "" ? undefined : value))
  .optional();

const optionalGoalSchema = z
  .union([z.enum(goalValues), z.literal("")])
  .transform((value) => (value === "" ? undefined : value))
  .optional();

function requiredNumber(
  label: string,
  min: number,
  max: number,
  minMessage: string,
  maxMessage: string,
  integer = false
) {
  let schema = z
    .number({ message: `${label} is required.` })
    .refine((value) => !Number.isNaN(value), {
      message: `${label} is required.`,
    });

  if (integer) {
    schema = schema.int(`${label} must be a whole number.`);
  }

  return schema.min(min, minMessage).max(max, maxMessage);
}

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or fewer."),
  age: requiredNumber(
    "Age",
    18,
    120,
    "You must be at least 18 years old.",
    "Enter a valid age.",
    true
  ),
  sex: z.enum(sexValues, { message: "Select your sex." }),
  heightCm: requiredNumber(
    "Height",
    100,
    250,
    "Height must be at least 100 cm.",
    "Height must be 250 cm or less."
  ),
  weightKg: requiredNumber(
    "Weight",
    30,
    300,
    "Weight must be at least 30 kg.",
    "Weight must be 300 kg or less."
  ),
  country: z.string().min(1, "Select your country."),
  activityLevel: z.enum(activityValues, {
    message: "Select your activity level.",
  }),
  diabetesStatus: optionalHealthStatusSchema,
  hypertensionStatus: optionalHealthStatusSchema,
  goalType: optionalGoalSchema,
});

export const onboardingStepSchemas = [
  profileSchema.pick({ name: true, age: true, sex: true }),
  profileSchema.pick({ heightCm: true, weightKg: true }),
  profileSchema.pick({ country: true, activityLevel: true }),
  profileSchema.pick({
    diabetesStatus: true,
    hypertensionStatus: true,
    goalType: true,
  }),
] as const;

export type ProfileFormInput = z.input<typeof profileSchema>;
export type ProfileInput = z.output<typeof profileSchema>;
export type OnboardingStepIndex = 0 | 1 | 2 | 3;

export const numberFieldOptions = {
  setValueAs: (value: string | number) => {
    if (value === "" || value === null || value === undefined) {
      return Number.NaN;
    }

    return typeof value === "number" ? value : Number(value);
  },
} as const;
