import type { Metadata } from "next";
import {
  Activity,
  Flame,
  LayoutDashboard,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { SprintNotice } from "@/components/layout/sprint-notice";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your AfriMet health dashboard.",
};

const placeholderCards = [
  {
    icon: Flame,
    label: "Today's Calories",
    value: "—",
    description: "Daily intake",
  },
  {
    icon: Activity,
    label: "Metabolic Score",
    value: "—",
    description: "Meal health rating",
  },
  {
    icon: Utensils,
    label: "Meals Logged",
    value: "—",
    description: "Recent meals",
  },
  {
    icon: TrendingUp,
    label: "Weekly Trends",
    value: "—",
    description: "Nutrition over time",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    (user?.user_metadata?.name as string | undefined) ?? user?.email ?? "there";

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

      <SprintNotice
        className="mt-5"
        description="Meal tracking and analytics will be added in later releases. Your account is active and ready."
        sprint="Coming soon"
        title="Dashboard preview"
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {placeholderCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border/60 bg-card p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <card.icon aria-hidden className="h-4 w-4" />
              <span className="text-sm font-medium">{card.label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {card.value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-5 text-center">
        <p className="text-sm font-medium text-foreground">
          Charts will appear here
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Meal trends and nutrition breakdowns will show once tracking is
          available.
        </p>
      </div>
    </PageContainer>
  );
}
