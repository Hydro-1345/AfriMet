"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Lightbulb, Loader2, RefreshCw } from "lucide-react";
import { AuthMessage } from "@/components/auth/auth-message";
import {
  RecommendationsEmptyState,
  RecommendationsList,
  RecommendationsUnavailableState,
} from "@/components/recommendations/recommendations-list";
import { generateRecommendationsAction } from "@/lib/recommendations/actions";
import { Button } from "@/components/ui/button";
import type { MealRecommendations } from "@/types/recommendation";

interface RecommendationsSectionProps {
  mealId: string;
  initialRecommendations: MealRecommendations | null;
  canGenerate: boolean;
  errorMessage?: string | null;
}

export function RecommendationsSection({
  mealId,
  initialRecommendations,
  canGenerate,
  errorMessage,
}: RecommendationsSectionProps) {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [error, setError] = useState<string | null>(errorMessage ?? null);
  const [isPending, setIsPending] = useState(false);

  const regenerate = useCallback(async (force = false) => {
    setError(null);
    setIsPending(true);

    try {
      const result = await generateRecommendationsAction({ mealId, force });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.recommendations) {
        setRecommendations(result.recommendations);
      }

      router.refresh();
    } finally {
      setIsPending(false);
    }
  }, [mealId, router]);

  if (!canGenerate) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lightbulb aria-hidden className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Personalized recommendations
            </h2>
            <p className="text-sm text-muted-foreground">
              Practical suggestions from your stored analysis and profile.
            </p>
          </div>
        </div>
        <RecommendationsUnavailableState />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lightbulb aria-hidden className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Personalized recommendations
            </h2>
            <p className="text-sm text-muted-foreground">
              Practical suggestions from your stored analysis and profile.
            </p>
          </div>
        </div>
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
          Refresh
        </Button>
      </div>

      {isPending && !recommendations ? (
        <div className="rounded-xl border border-border/60 bg-card px-6 py-8 text-center shadow-sm">
          <Loader2 aria-hidden className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-foreground">
            Generating recommendations...
          </p>
        </div>
      ) : null}

      {error ? <AuthMessage message={error} variant="error" /> : null}

      {recommendations && recommendations.recommendations.length > 0 ? (
        <RecommendationsList recommendations={recommendations} />
      ) : !isPending ? (
        <RecommendationsEmptyState />
      ) : null}
    </section>
  );
}
