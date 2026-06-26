import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MEAL_IMAGE_BUCKET,
  SIGNED_URL_EXPIRY_SECONDS,
} from "@/lib/meals/constants";

export function getMealImageExtension(file: File): string {
  const name = file.name.toLowerCase();
  const dotIndex = name.lastIndexOf(".");

  if (dotIndex === -1) {
    return "jpg";
  }

  return name.slice(dotIndex + 1);
}

export function validateMealImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return "Upload a JPG, PNG, or HEIC image.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Image must be 5 MB or smaller.";
  }

  return null;
}

export function buildMealImagePath(
  userId: string,
  mealId: string,
  extension: string
): string {
  return `${userId}/${mealId}/image.${extension}`;
}

export async function uploadMealImage(
  supabase: SupabaseClient,
  userId: string,
  mealId: string,
  file: File
): Promise<{ path: string | null; error: string | null }> {
  const validationError = validateMealImage(file);

  if (validationError) {
    return { path: null, error: validationError };
  }

  const extension = getMealImageExtension(file);
  const path = buildMealImagePath(userId, mealId, extension);

  const { error } = await supabase.storage
    .from(MEAL_IMAGE_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    return { path: null, error: "Unable to upload meal image. Please try again." };
  }

  return { path, error: null };
}

export async function deleteMealImage(
  supabase: SupabaseClient,
  path: string | null
): Promise<void> {
  if (!path) {
    return;
  }

  await supabase.storage.from(MEAL_IMAGE_BUCKET).remove([path]);
}

export async function getMealImageSignedUrl(
  supabase: SupabaseClient,
  path: string | null
): Promise<string | null> {
  if (!path) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(MEAL_IMAGE_BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}
