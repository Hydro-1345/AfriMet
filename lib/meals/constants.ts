export const MEAL_IMAGE_BUCKET = "meal-images" as const;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
] as const;

export const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".heic", ".heif"] as const;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const MAX_RECENT_MEALS = 5;

export const SIGNED_URL_EXPIRY_SECONDS = 3600;
