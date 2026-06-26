"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isProfileComplete } from "@/lib/profile/completion";
import { fetchUserProfile } from "@/lib/profile/queries";
import { type ProfileInput, profileSchema } from "@/lib/profile/schemas";
import { createClient } from "@/lib/supabase/server";
import type { ProfileActionResult, UserProfile } from "@/types/profile";

function mapProfileError(message: string): string {
  if (message.includes("profiles_age_range")) {
    return "Age must be between 18 and 120.";
  }

  if (message.includes("profiles_height_range")) {
    return "Height must be between 100 and 250 cm.";
  }

  if (message.includes("profiles_weight_range")) {
    return "Weight must be between 30 and 300 kg.";
  }

  return "Unable to save your profile. Please try again.";
}

async function requireAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function getProfileAction(): Promise<UserProfile | null> {
  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return null;
  }

  const supabase = await createClient();
  return fetchUserProfile(supabase, userId);
}

export async function saveProfileAction(
  input: ProfileInput,
  options?: { redirectTo?: string }
): Promise<ProfileActionResult> {
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid profile data.",
    };
  }

  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return { error: "You must be signed in to save your profile." };
  }

  const supabase = await createClient();
  const data = parsed.data;

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      name: data.name,
      age: data.age,
      sex: data.sex,
      country: data.country,
      height_cm: data.heightCm,
      weight_kg: data.weightKg,
      activity_level: data.activityLevel,
    },
    { onConflict: "id" }
  );

  if (profileError) {
    return { error: mapProfileError(profileError.message) };
  }

  const { error: healthError } = await supabase.from("health_profiles").upsert(
    {
      user_id: userId,
      diabetes_status: data.diabetesStatus ?? null,
      hypertension_status: data.hypertensionStatus ?? null,
      goal_type: data.goalType ?? null,
    },
    { onConflict: "user_id" }
  );

  if (healthError) {
    return { error: mapProfileError(healthError.message) };
  }

  const profile = await fetchUserProfile(supabase, userId);

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/profile");
  revalidatePath("/onboarding");

  if (options?.redirectTo) {
    redirect(options.redirectTo);
  }

  return {
    success: true,
    message: "Profile saved successfully.",
    profile: profile ?? undefined,
  };
}

export async function completeOnboardingAction(
  input: ProfileInput
): Promise<ProfileActionResult> {
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid profile data.",
    };
  }

  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return { error: "You must be signed in to complete onboarding." };
  }

  const result = await saveProfileAction(parsed.data);

  if (result.error) {
    return result;
  }

  const supabase = await createClient();
  const profile = await fetchUserProfile(supabase, userId);

  if (!isProfileComplete(profile)) {
    return {
      error: "Please complete all required profile fields before continuing.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
