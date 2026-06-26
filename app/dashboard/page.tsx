import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { ProfileCompletionCard } from "@/components/profile/profile-completion-card";
import { isProfileComplete } from "@/lib/profile/completion";
import { fetchUserProfile } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your AfriMet health dashboard.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await fetchUserProfile(supabase, user.id);

  if (!isProfileComplete(profile)) {
    redirect("/onboarding");
  }

  const displayName = profile?.name ?? user.email ?? "there";

  return (
    <PageContainer className="py-6 sm:py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LayoutDashboard aria-hidden className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Welcome back, {displayName}
          </p>
        </div>
      </div>

      <ProfileCompletionCard className="mt-6" profile={profile} />

      <div className="mt-6 rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-8 text-center">
        <p className="text-sm font-medium text-foreground">
          Meal tracking and analytics are coming soon
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your profile is set up. Meal logging, nutrition insights, and
          metabolic recommendations will appear here in future releases.
        </p>
        <div className="mt-5">
          <Button asChild variant="outline">
            <Link href="/profile">Edit profile</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
