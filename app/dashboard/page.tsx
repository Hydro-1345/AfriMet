import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import { DashboardAnalyticsSection } from "@/components/dashboard/dashboard-analytics-section";
import { DashboardErrorState } from "@/components/dashboard/dashboard-error-state";
import { RecentMeals } from "@/components/meals/recent-meals";
import { PageContainer } from "@/components/layout/page-container";
import { ProfileCompletionCard } from "@/components/profile/profile-completion-card";
import { analyticsPeriodSchema } from "@/lib/analytics/schemas";
import { fetchMealSummary } from "@/lib/meals/queries";
import { isProfileComplete } from "@/lib/profile/completion";
import { fetchUserProfile } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";
import { getUserDashboardAnalytics } from "@/services/analytics.service";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your AfriMet health dashboard.",
};

interface DashboardPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getSearchParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
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

  const rawParams = await searchParams;
  const parsedPeriod = analyticsPeriodSchema.safeParse({
    period: getSearchParam(rawParams, "period") ?? "30d",
  });
  const period = parsedPeriod.success ? parsedPeriod.data.period : "30d";

  const displayName = profile?.name ?? user.email ?? "there";

  const [mealSummary, analyticsResult] = await Promise.all([
    fetchMealSummary(supabase, user.id),
    getUserDashboardAnalytics(user.id, period),
  ]);

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

      <div className="mt-6">
        {analyticsResult.error || !analyticsResult.analytics ? (
          <DashboardErrorState
            message={
              analyticsResult.error ??
              "Unable to load dashboard analytics. Please try again."
            }
          />
        ) : (
          <DashboardAnalyticsSection analytics={analyticsResult.analytics} />
        )}
      </div>

      <div className="mt-6">
        <RecentMeals
          meals={mealSummary.recentMeals}
          totalCount={mealSummary.totalCount}
        />
      </div>
    </PageContainer>
  );
}
