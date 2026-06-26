"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { AuthMessage } from "@/components/auth/auth-message";
import { HealthInsightsList } from "@/components/metabolic/health-insights-list";
import { MetabolicScoreCard } from "@/components/metabolic/metabolic-score-card";
import { NutrientInterpretationList } from "@/components/metabolic/nutrient-interpretation-list";
import { generateMetabolicAssessmentAction } from "@/lib/metabolic/actions";
import { Button } from "@/components/ui/button";
import type { MetabolicAssessment } from "@/types/metabolic";

interface MetabolicInsightsSectionProps {
  mealId: string;
  initialAssessment: MetabolicAssessment | null;
  canGenerate: boolean;
  errorMessage?: string | null;
}

export function MetabolicInsightsSection({
  mealId,
  initialAssessment,
  canGenerate,
  errorMessage,
}: MetabolicInsightsSectionProps) {
  const router = useRouter();
  const [assessment, setAssessment] = useState(initialAssessment);
  const [error, setError] = useState<string | null>(errorMessage ?? null);
  const [isPending, setIsPending] = useState(false);

  const regenerate = useCallback(async (force = false) => {
    setError(null);
    setIsPending(true);

    try {
      const result = await generateMetabolicAssessmentAction({ mealId, force });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.assessment) {
        setAssessment(result.assessment);
      }

      router.refresh();
    } finally {
      setIsPending(false);
    }
  }, [mealId, router]);

  if (!canGenerate) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-8 text-center">
        <p className="text-sm font-medium text-foreground">
          Metabolic insights unavailable
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Complete AI meal analysis first to generate metabolic health insights.
        </p>
      </div>
    );
  }

  if (isPending && !assessment) {
    return (
      <div className="rounded-xl border border-border/60 bg-card px-6 py-8 text-center shadow-sm">
        <Loader2 aria-hidden className="mx-auto h-6 w-6 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium text-foreground">
          Generating metabolic insights...
        </p>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="space-y-4">
        <AuthMessage message={error} variant="error" />
        <Button disabled={isPending} onClick={() => regenerate(true)} type="button">
          {isPending ? (
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw aria-hidden className="h-4 w-4" />
          )}
          Try again
        </Button>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Insights based on stored nutrition analysis — no new AI call required.
        </p>
        <Button
          disabled={isPending}
          onClick={() => regenerate(true)}
          size="sm"
          type="button"
          variant="outline"
        >
          {isPending ? (
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw aria-hidden className="h-4 w-4" />
          )}
          Refresh insights
        </Button>
      </div>

      {error ? <AuthMessage message={error} variant="error" /> : null}

      <MetabolicScoreCard assessment={assessment} />
      <NutrientInterpretationList interpretations={assessment.nutrientInterpretations} />
      <HealthInsightsList insights={assessment.insights} />
    </div>
  );
}
