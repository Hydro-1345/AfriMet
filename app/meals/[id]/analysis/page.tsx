import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MealAnalysisView } from "@/components/analysis/meal-analysis-view";
import { PageContainer } from "@/components/layout/page-container";
import { fetchMealAnalysis } from "@/lib/analysis/queries";
import { formatMealDate, hasMealImage } from "@/lib/meals/format";
import { fetchMealById } from "@/lib/meals/queries";
import { isProfileComplete } from "@/lib/profile/completion";
import { fetchUserProfile } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";
import { ensureMetabolicAssessment } from "@/services/metabolic.service";
import { Button } from "@/components/ui/button";

interface MealAnalysisPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getSearchParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
}: MealAnalysisPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Meal Analysis",
    description: `AI nutrition analysis for meal ${id}.`,
  };
}

export default async function MealAnalysisPage({
  params,
  searchParams,
}: MealAnalysisPageProps) {
  const { id } = await params;
  const rawSearchParams = await searchParams;
  const shouldAutoStart = getSearchParam(rawSearchParams, "start") === "1";
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

  let metabolicAssessment = null;
  let metabolicError: string | null = null;

  if (analysis?.status === "completed" && analysis.nutrition) {
    const metabolicResult = await ensureMetabolicAssessment(user.id, id);

    if (metabolicResult.error) {
      metabolicError = metabolicResult.error;
    } else {
      metabolicAssessment = metabolicResult.assessment ?? null;
    }
  }

  return (
    <PageContainer className="max-w-2xl py-6 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles aria-hidden className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Meal analysis
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {formatMealDate(meal.mealDate)}
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href={`/meals/${meal.id}`}>Back to meal</Link>
        </Button>
      </div>

      {hasMealImage(meal) ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
          <Image
            alt="Meal photo"
            className="h-48 w-full object-cover sm:h-56"
            height={224}
            src={meal.imageSignedUrl!}
            width={640}
          />
        </div>
      ) : null}

      <section className="mt-6 rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">Meal description</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground sm:text-base">
          {meal.description.trim() || "No description provided."}
        </p>
      </section>

      <MealAnalysisView
        analysis={analysis}
        autoStart={shouldAutoStart && analysis?.status !== "completed"}
        meal={meal}
        metabolicAssessment={metabolicAssessment}
        metabolicError={metabolicError}
      />
    </PageContainer>
  );
}
