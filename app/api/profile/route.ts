import { NextResponse } from "next/server";
import { isProfileComplete } from "@/lib/profile/completion";
import { fetchUserProfile } from "@/lib/profile/queries";
import { profileSchema } from "@/lib/profile/schemas";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await fetchUserProfile(supabase, user.id);

  if (!profile) {
    return NextResponse.json(
      {
        profile: null,
        isComplete: false,
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    profile,
    isComplete: isProfileComplete(profile),
  });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid profile data." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
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
    return NextResponse.json(
      { error: "Unable to save profile." },
      { status: 500 }
    );
  }

  const { error: healthError } = await supabase.from("health_profiles").upsert(
    {
      user_id: user.id,
      diabetes_status: data.diabetesStatus ?? null,
      hypertension_status: data.hypertensionStatus ?? null,
      goal_type: data.goalType ?? null,
    },
    { onConflict: "user_id" }
  );

  if (healthError) {
    return NextResponse.json(
      { error: "Unable to save health profile." },
      { status: 500 }
    );
  }

  const profile = await fetchUserProfile(supabase, user.id);

  return NextResponse.json({
    profile,
    isComplete: profile ? isProfileComplete(profile) : false,
  });
}
