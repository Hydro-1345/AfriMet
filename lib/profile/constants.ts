export const ACTIVITY_LEVELS = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Mostly sitting during the day.",
  },
  {
    value: "lightly_active",
    label: "Lightly active",
    description: "Light exercise 1–2 days each week.",
  },
  {
    value: "moderately_active",
    label: "Moderately active",
    description: "Exercise 3–5 days each week.",
  },
  {
    value: "very_active",
    label: "Very active",
    description: "Exercise most days.",
  },
  {
    value: "extremely_active",
    label: "Extremely active",
    description: "Daily intense training or physically demanding work.",
  },
] as const;

export const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

export const HEALTH_STATUS_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const GOAL_OPTIONS = [
  { value: "weight_loss", label: "Lose weight" },
  { value: "weight_gain", label: "Gain weight" },
  { value: "maintenance", label: "Maintain weight" },
] as const;

export const COUNTRIES = [
  { value: "NG", label: "Nigeria" },
  { value: "GH", label: "Ghana" },
  { value: "KE", label: "Kenya" },
  { value: "ZA", label: "South Africa" },
  { value: "ET", label: "Ethiopia" },
  { value: "TZ", label: "Tanzania" },
  { value: "UG", label: "Uganda" },
  { value: "RW", label: "Rwanda" },
  { value: "SN", label: "Senegal" },
  { value: "CI", label: "Côte d'Ivoire" },
  { value: "CM", label: "Cameroon" },
  { value: "EG", label: "Egypt" },
  { value: "MA", label: "Morocco" },
  { value: "AO", label: "Angola" },
  { value: "MZ", label: "Mozambique" },
  { value: "ZW", label: "Zimbabwe" },
  { value: "BW", label: "Botswana" },
  { value: "NA", label: "Namibia" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "FR", label: "France" },
  { value: "DE", label: "Germany" },
  { value: "OTHER", label: "Other" },
] as const;

export const ONBOARDING_STEPS = [
  { id: 1, title: "About you", description: "Basic details" },
  { id: 2, title: "Body metrics", description: "Height and weight" },
  { id: 3, title: "Lifestyle", description: "Country and activity" },
  { id: 4, title: "Health goals", description: "Optional — skip if you prefer" },
] as const;
