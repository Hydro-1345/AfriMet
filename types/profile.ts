import type { ProfileInput } from "@/lib/profile/schemas";

export type Sex = ProfileInput["sex"];
export type ActivityLevel = ProfileInput["activityLevel"];
export type HealthStatus = NonNullable<ProfileInput["diabetesStatus"]>;
export type GoalType = NonNullable<ProfileInput["goalType"]>;

export type UserProfile = {
  id: string;
  name: string;
  age: number | null;
  sex: Sex | null;
  country: string | null;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: ActivityLevel | null;
  diabetesStatus: HealthStatus | null;
  hypertensionStatus: HealthStatus | null;
  goalType: GoalType | null;
  createdAt: string;
  updatedAt: string;
};

export type ProfileRow = {
  id: string;
  name: string;
  age: number | null;
  sex: Sex | null;
  country: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: ActivityLevel | null;
  created_at: string;
  updated_at: string;
};

export type HealthProfileRow = {
  user_id: string;
  diabetes_status: HealthStatus | null;
  hypertension_status: HealthStatus | null;
  goal_type: GoalType | null;
  created_at: string;
  updated_at: string;
};

export type ProfileActionResult = {
  error?: string;
  success?: boolean;
  message?: string;
  profile?: UserProfile;
};
