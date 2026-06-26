import type { UserProfile } from "@/types/profile";

const REQUIRED_PROFILE_FIELDS: (keyof Pick<
  UserProfile,
  "age" | "sex" | "heightCm" | "weightKg" | "country" | "activityLevel"
>)[] = [
  "age",
  "sex",
  "heightCm",
  "weightKg",
  "country",
  "activityLevel",
];

export function isProfileComplete(profile: UserProfile | null): boolean {
  if (!profile) {
    return false;
  }

  return REQUIRED_PROFILE_FIELDS.every((field) => {
    const value = profile[field];
    return value !== null && value !== undefined && value !== "";
  });
}

export function getProfileCompletionPercent(
  profile: UserProfile | null
): number {
  if (!profile) {
    return 0;
  }

  const filled = REQUIRED_PROFILE_FIELDS.filter((field) => {
    const value = profile[field];
    return value !== null && value !== undefined && value !== "";
  }).length;

  return Math.round((filled / REQUIRED_PROFILE_FIELDS.length) * 100);
}

export function getMissingProfileFields(
  profile: UserProfile | null
): string[] {
  if (!profile) {
    return [
      "Age",
      "Sex",
      "Height",
      "Weight",
      "Country",
      "Activity level",
    ];
  }

  const labels: Record<(typeof REQUIRED_PROFILE_FIELDS)[number], string> = {
    age: "Age",
    sex: "Sex",
    heightCm: "Height",
    weightKg: "Weight",
    country: "Country",
    activityLevel: "Activity level",
  };

  return REQUIRED_PROFILE_FIELDS.filter((field) => {
    const value = profile[field];
    return value === null || value === undefined || value === "";
  }).map((field) => labels[field]);
}
