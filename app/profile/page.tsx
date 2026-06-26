import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { PageContainer } from "@/components/layout/page-container";
import { ProfileCompletionCard } from "@/components/profile/profile-completion-card";
import { PendingButtonLink } from "@/components/ui/pending-button-link";
import { fetchUserProfile } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your AfriMet health profile.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await fetchUserProfile(supabase, user.id);

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <PageContainer className="max-w-2xl py-6 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserRound aria-hidden className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Your profile
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Update your details anytime.
              </p>
            </div>
          </div>
        </div>
        <PendingButtonLink href="/dashboard" pendingText="Loading..." variant="outline">
          Back to dashboard
        </PendingButtonLink>
      </div>

      <ProfileCompletionCard className="mt-6" profile={profile} />
      <EditProfileForm profile={profile} />
    </PageContainer>
  );
}
