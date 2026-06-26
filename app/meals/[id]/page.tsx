import type { Metadata } from "next";
import { Sparkles, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DeleteMealButton } from "@/components/meals/delete-meal-button";
import { PageContainer } from "@/components/layout/page-container";
import { fetchMealAnalysis } from "@/lib/analysis/queries";
import { getGlycemicImpactLabel, getSatietyEstimateLabel } from "@/lib/metabolic/queries";
import { formatMealDate, hasMealImage } from "@/lib/meals/format";
import { fetchMealById } from "@/lib/meals/queries";
import { isProfileComplete } from "@/lib/profile/completion";
import { fetchUserProfile } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";
import { getMetabolicAssessmentForMeal } from "@/services/metabolic.service";
import { getMealRecommendationsForMeal } from "@/services/recommendation.service";
import { Button } from "@/components/ui/button";

interface MealDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MealDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Meal Details",
    description: `View meal ${id} in your AfriMet history.`,
  };
}

export default async function MealDetailPage({ params }: MealDetailPageProps) {
  const { id } = await params;
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

  const meal = await fetchMealById(supabase, user.id, id);

  if (!meal) {
    notFound();
  }

  const analysis = await fetchMealAnalysis(supabase, user.id, id);
  const metabolicAssessment =
    analysis?.status === "completed" && analysis.nutrition
      ? await getMetabolicAssessmentForMeal(user.id, id)
      : null;
  const mealRecommendations =
    analysis?.status === "completed" && analysis.nutrition
      ? await getMealRecommendationsForMeal(user.id, id)
      : null;
  const topRecommendation = mealRecommendations?.recommendations[0] ?? null;

  return (
    <PageContainer className="max-w-2xl py-6 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UtensilsCrossed aria-hidden className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Meal details
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {formatMealDate(meal.mealDate)}
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/meals">Back to history</Link>
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {hasMealImage(meal) ? (
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
            <Image
              alt="Meal photo"
              className="h-64 w-full object-cover sm:h-80"
              height={320}
              src={meal.imageSignedUrl!}
              width={960}
            />
          </div>
        ) : null}

        <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Description</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground sm:text-base">
            {meal.description}
          </p>
        </section>

        {analysis?.status === "completed" && analysis.nutrition ? (
          <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Nutrition & metabolic insights</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {Math.round(analysis.nutrition.calories)} kcal ·{" "}
              {Math.round(analysis.nutrition.protein)} g protein ·{" "}
              {Math.round(analysis.nutrition.carbs)} g carbs
            </p>
            {metabolicAssessment ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {getGlycemicImpactLabel(metabolicAssessment.score.glycemicImpact)} ·{" "}
                {getSatietyEstimateLabel(metabolicAssessment.score.satietyEstimate)}
              </p>
            ) : null}
            {topRecommendation ? (
              <p className="mt-2 text-sm text-foreground">
                Top suggestion: {topRecommendation.recommendationText}
              </p>
            ) : null}
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link href={`/meals/${meal.id}/analysis`}>View full analysis</Link>
              </Button>
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-6">
            <p className="text-sm font-medium text-foreground">No AI analysis yet</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Analyze this meal to get nutrition estimates and detected foods.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href={`/meals/${meal.id}/analysis?start=1`}>
                  <Sparkles aria-hidden className="h-4 w-4" />
                  Analyze meal
                </Link>
              </Button>
            </div>
          </section>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild>
            <Link href={`/meals/${meal.id}/edit`}>Edit meal</Link>
          </Button>
          <DeleteMealButton mealId={meal.id} />
        </div>
      </div>
    </PageContainer>
  );
}
