import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MEAL_IMAGE_BUCKET,
} from "@/lib/meals/constants";

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  heic: "image/heic",
  heif: "image/heif",
};

function getMimeTypeFromPath(path: string): string | null {
  const extension = path.split(".").pop()?.toLowerCase();
  if (!extension) return null;
  return MIME_BY_EXTENSION[extension] ?? null;
}

export async function downloadMealImageBuffer(
  supabase: SupabaseClient,
  path: string
): Promise<{ buffer: Buffer | null; mimeType: string; error: string | null }> {
  const mimeType = getMimeTypeFromPath(path);

  if (!mimeType || !ACCEPTED_IMAGE_TYPES.includes(mimeType as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return {
      buffer: null,
      mimeType: "image/jpeg",
      error: "Unsupported meal image format.",
    };
  }

  const { data, error } = await supabase.storage.from(MEAL_IMAGE_BUCKET).download(path);

  if (error || !data) {
    return {
      buffer: null,
      mimeType,
      error: "Unable to read the meal image.",
    };
  }

  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.byteLength > MAX_IMAGE_SIZE_BYTES) {
    return {
      buffer: null,
      mimeType,
      error: "Meal image is too large to analyze.",
    };
  }

  return { buffer, mimeType, error: null };
}
