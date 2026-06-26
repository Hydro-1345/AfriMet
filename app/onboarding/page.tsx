import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/profile/onboarding-form";
import { PageContainer } from "@/components/layout/page-container";
import { fetchUserProfile } from "@/lib/profile/queries";
import { isProfileComplete } from "@/lib/profile/completion";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Complete your AfriMet health profile.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await fetchUserProfile(supabase, user.id);

  if (isProfileComplete(profile)) {
    redirect("/dashboard");
  }

  const defaultName =
    profile?.name ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "";

  return (
    <PageContainer className="max-w-2xl py-6 sm:py-8">
      <div className="text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UserRound aria-hidden className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Set up your profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Tell us a little about yourself so AfriMet can provide culturally
          relevant metabolic guidance.
        </p>
      </div>

      <OnboardingForm defaultName={defaultName} existingProfile={profile} />
    </PageContainer>
  );
}
