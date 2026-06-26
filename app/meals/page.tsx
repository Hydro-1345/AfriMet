import type { Metadata } from "next";
import { Plus, UtensilsCrossed } from "lucide-react";
import { redirect } from "next/navigation";
import { PendingButtonLink } from "@/components/ui/pending-button-link";
import { MealList } from "@/components/meals/meal-list";
import { PageContainer } from "@/components/layout/page-container";
import { isProfileComplete } from "@/lib/profile/completion";
import { fetchUserProfile } from "@/lib/profile/queries";
import { fetchUserMeals } from "@/lib/meals/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Meal History",
  description: "View and manage your logged meals.",
};

export default async function MealsPage() {
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

  const meals = await fetchUserMeals(supabase, user.id);

  return (
    <PageContainer className="py-6 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UtensilsCrossed aria-hidden className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Meal history
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {meals.length === 0
                ? "Your logged meals will appear here."
                : `${meals.length} meal${meals.length === 1 ? "" : "s"} logged.`}
            </p>
          </div>
        </div>
        <PendingButtonLink href="/meals/new" pendingText="Opening...">
          <Plus aria-hidden className="h-4 w-4" />
          Log meal
        </PendingButtonLink>
      </div>

      <div className="mt-6">
        <MealList meals={meals} />
      </div>
    </PageContainer>
  );
}
