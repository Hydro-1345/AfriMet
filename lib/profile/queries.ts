import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  HealthProfileRow,
  ProfileRow,
  UserProfile,
} from "@/types/profile";

export function mapProfileRows(
  profile: ProfileRow | null,
  healthProfile: HealthProfileRow | null
): UserProfile | null {
  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    sex: profile.sex,
    country: profile.country,
    heightCm: profile.height_cm,
    weightKg: profile.weight_kg,
    activityLevel: profile.activity_level,
    diabetesStatus: healthProfile?.diabetes_status ?? null,
    hypertensionStatus: healthProfile?.hypertension_status ?? null,
    goalType: healthProfile?.goal_type ?? null,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

export async function fetchUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfile | null> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, name, age, sex, country, height_cm, weight_kg, activity_level, created_at, updated_at"
    )
    .eq("id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  const { data: healthProfile } = await supabase
    .from("health_profiles")
    .select(
      "user_id, diabetes_status, hypertension_status, goal_type, created_at, updated_at"
    )
    .eq("user_id", userId)
    .maybeSingle();

  return mapProfileRows(profile as ProfileRow, healthProfile as HealthProfileRow | null);
}

export async function fetchProfileCompletionStatus(
  supabase: SupabaseClient,
  userId: string
): Promise<{ exists: boolean; isComplete: boolean }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("age, sex, country, height_cm, weight_kg, activity_level")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return { exists: false, isComplete: false };
  }

  const isComplete =
    data.age !== null &&
    data.sex !== null &&
    data.country !== null &&
    data.height_cm !== null &&
    data.weight_kg !== null &&
    data.activity_level !== null;

  return { exists: true, isComplete };
}
