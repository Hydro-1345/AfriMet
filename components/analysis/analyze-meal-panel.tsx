"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { AuthMessage } from "@/components/auth/auth-message";
import { analyzeMealAction } from "@/lib/analysis/actions";
import { Button } from "@/components/ui/button";
import type { MealAnalysis } from "@/types/analysis";

const autoStartedMealIds = new Set<string>();

interface AnalyzeMealPanelProps {
  mealId: string;
  hasDescription: boolean;
  hasImage: boolean;
  existingAnalysis?: MealAnalysis | null;
  autoStart?: boolean;
  onPendingChange?: (pending: boolean) => void;
}

export function AnalyzeMealPanel({
  mealId,
  hasDescription,
  hasImage,
  existingAnalysis,
  autoStart = false,
  onPendingChange,
}: AnalyzeMealPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isMountedRef = useRef(true);

  const canAnalyze = hasDescription || hasImage;
  const hasCompletedAnalysis = existingAnalysis?.status === "completed";
  const hasFailedAnalysis = existingAnalysis?.status === "failed";

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const runAnalysis = useCallback(async (force = false) => {
    setError(null);
    setSuccessMessage(null);
    setIsPending(true);

    try {
      const result = await analyzeMealAction({ mealId, force });

      if (!isMountedRef.current) {
        return;
      }

      if (result.error) {
        setError(result.error);
        router.refresh();
        return;
      }

      setSuccessMessage(
        result.cached
          ? "Showing your saved analysis."
          : result.message ?? "Meal analyzed successfully."
      );
      router.refresh();
    } finally {
      if (isMountedRef.current) {
        setIsPending(false);
      }
    }
  }, [mealId, router]);

  useEffect(() => {
    if (!autoStart || !canAnalyze || hasCompletedAnalysis) {
      return;
    }

    if (autoStartedMealIds.has(mealId)) {
      return;
    }

    autoStartedMealIds.add(mealId);
    router.replace(`/meals/${mealId}/analysis`, { scroll: false });
    void runAnalysis(false);
  }, [autoStart, canAnalyze, hasCompletedAnalysis, mealId, router, runAnalysis]);

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">AI meal analysis</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasImage && hasDescription
            ? "Analyze using your description and photo."
            : hasImage
              ? "Analyze using your meal photo."
              : hasDescription
                ? "Analyze using your meal description."
                : "Add a description or photo before analyzing."}
        </p>
      </div>

      {!canAnalyze ? (
        <AuthMessage
          message="Add a meal description or upload a photo before running analysis."
          variant="error"
        />
      ) : null}

      {error ? <AuthMessage message={error} variant="error" /> : null}
      {successMessage ? (
        <AuthMessage message={successMessage} variant="success" />
      ) : null}

      <div className="flex flex-wrap gap-2">
        {!hasCompletedAnalysis ? (
          <Button
            disabled={!canAnalyze || isPending}
            onClick={() => runAnalysis(false)}
            type="button"
          >
            {isPending ? (
              <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles aria-hidden className="h-4 w-4" />
            )}
            {isPending ? "Analyzing meal..." : "Analyze meal"}
          </Button>
        ) : null}

        {(hasCompletedAnalysis || hasFailedAnalysis) && canAnalyze ? (
          <Button
            disabled={isPending}
            onClick={() => runAnalysis(true)}
            type="button"
            variant={hasCompletedAnalysis ? "default" : "outline"}
          >
            {isPending ? (
              <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw aria-hidden className="h-4 w-4" />
            )}
            {isPending ? "Analyzing meal..." : "Re-analyze"}
          </Button>
        ) : null}
      </div>

      {isPending ? (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          Running AI analysis. This may take up to a minute...
        </p>
      ) : null}
    </div>
  );
}
