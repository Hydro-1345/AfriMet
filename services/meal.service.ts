"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchMealById, fetchUserMeals } from "@/lib/meals/queries";
import { type MealInput, mealSchema } from "@/lib/meals/schemas";
import {
  deleteMealImage,
  uploadMealImage,
} from "@/lib/meals/storage";
import { createClient } from "@/lib/supabase/server";
import type { Meal, MealActionResult } from "@/types/meal";

function mapMealError(message: string): string {
  if (message.includes("meals_description_length")) {
    return "Description must be between 1 and 2000 characters.";
  }

  return "Unable to save your meal. Please try again.";
}

async function requireAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

function parseMealFormData(formData: FormData): {
  input: MealInput | null;
  image: File | null;
  error: string | null;
} {
  const description = String(formData.get("description") ?? "");
  const mealDate = String(formData.get("mealDate") ?? "");
  const removeImage = formData.get("removeImage") === "true";
  const imageEntry = formData.get("image");

  const parsed = mealSchema.safeParse({
    description,
    mealDate,
    removeImage,
  });

  if (!parsed.success) {
    return {
      input: null,
      image: null,
      error: parsed.error.issues[0]?.message ?? "Invalid meal data.",
    };
  }

  const image =
    imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null;

  return { input: parsed.data, image, error: null };
}

export async function getMealsAction(): Promise<Meal[]> {
  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return [];
  }

  const supabase = await createClient();
  return fetchUserMeals(supabase, userId);
}

export async function getMealAction(mealId: string): Promise<Meal | null> {
  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return null;
  }

  const supabase = await createClient();
  return fetchMealById(supabase, userId, mealId);
}

export async function createMealAction(
  formData: FormData
): Promise<MealActionResult> {
  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return { error: "You must be signed in to log a meal." };
  }

  const { input, image, error } = parseMealFormData(formData);

  if (error || !input) {
    return { error: error ?? "Invalid meal data." };
  }

  const supabase = await createClient();
  const mealId = crypto.randomUUID();

  let imagePath: string | null = null;

  if (image) {
    const uploadResult = await uploadMealImage(supabase, userId, mealId, image);

    if (uploadResult.error) {
      return { error: uploadResult.error };
    }

    imagePath = uploadResult.path;
  }

  const { error: insertError } = await supabase.from("meals").insert({
    id: mealId,
    user_id: userId,
    description: input.description,
    image_url: imagePath,
    meal_date: new Date(input.mealDate).toISOString(),
  });

  if (insertError) {
    if (imagePath) {
      await deleteMealImage(supabase, imagePath);
    }

    return { error: mapMealError(insertError.message) };
  }

  const meal = await fetchMealById(supabase, userId, mealId);

  revalidatePath("/dashboard");
  revalidatePath("/meals");

  return {
    success: true,
    message: "Meal logged successfully.",
    meal: meal ?? undefined,
  };
}

export async function updateMealAction(
  mealId: string,
  formData: FormData
): Promise<MealActionResult> {
  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return { error: "You must be signed in to update a meal." };
  }

  const { input, image, error } = parseMealFormData(formData);

  if (error || !input) {
    return { error: error ?? "Invalid meal data." };
  }

  const supabase = await createClient();
  const existingMeal = await fetchMealById(supabase, userId, mealId);

  if (!existingMeal) {
    return { error: "Meal not found." };
  }

  let imagePath = existingMeal.imageUrl;

  if (input.removeImage && existingMeal.imageUrl) {
    await deleteMealImage(supabase, existingMeal.imageUrl);
    imagePath = null;
  }

  if (image) {
    const uploadResult = await uploadMealImage(supabase, userId, mealId, image);

    if (uploadResult.error) {
      return { error: uploadResult.error };
    }

    if (
      existingMeal.imageUrl &&
      existingMeal.imageUrl !== uploadResult.path
    ) {
      await deleteMealImage(supabase, existingMeal.imageUrl);
    }

    imagePath = uploadResult.path;
  }

  const { error: updateError } = await supabase
    .from("meals")
    .update({
      description: input.description,
      image_url: imagePath,
      meal_date: new Date(input.mealDate).toISOString(),
    })
    .eq("id", mealId)
    .eq("user_id", userId);

  if (updateError) {
    return { error: mapMealError(updateError.message) };
  }

  const meal = await fetchMealById(supabase, userId, mealId);

  revalidatePath("/dashboard");
  revalidatePath("/meals");
  revalidatePath(`/meals/${mealId}`);
  revalidatePath(`/meals/${mealId}/edit`);

  return {
    success: true,
    message: "Meal updated successfully.",
    meal: meal ?? undefined,
  };
}

export async function deleteMealAction(mealId: string): Promise<MealActionResult> {
  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return { error: "You must be signed in to delete a meal." };
  }

  const supabase = await createClient();
  const existingMeal = await fetchMealById(supabase, userId, mealId);

  if (!existingMeal) {
    return { error: "Meal not found." };
  }

  if (existingMeal.imageUrl) {
    await deleteMealImage(supabase, existingMeal.imageUrl);
  }

  const { error: deleteError } = await supabase
    .from("meals")
    .delete()
    .eq("id", mealId)
    .eq("user_id", userId);

  if (deleteError) {
    return { error: "Unable to delete meal. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/meals");

  return {
    success: true,
    message: "Meal deleted successfully.",
  };
}

export async function createMealAndRedirectAction(
  formData: FormData
): Promise<MealActionResult> {
  const result = await createMealAction(formData);

  if (result.error) {
    return result;
  }

  redirect("/meals");
}

export async function updateMealAndRedirectAction(
  mealId: string,
  formData: FormData
): Promise<MealActionResult> {
  const result = await updateMealAction(mealId, formData);

  if (result.error) {
    return result;
  }

  redirect(`/meals/${mealId}`);
}
