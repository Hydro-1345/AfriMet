export const OPENAI_MEAL_ANALYSIS_MODEL = "gpt-4o-mini" as const;

export const OPENAI_REQUEST_TIMEOUT_MS = 60_000;

export const FOOD_CONTEXT_LIMIT = 25;

export const CONFIDENCE_THRESHOLDS = {
  high: 0.75,
  medium: 0.5,
} as const;
