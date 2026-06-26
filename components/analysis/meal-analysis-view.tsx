import { AnalysisErrorState } from "@/components/analysis/analysis-error-state";
import { AnalysisPendingState } from "@/components/analysis/analysis-pending-state";
import { AnalysisSummaryCard } from "@/components/analysis/analysis-summary-card";
import { AnalyzeMealPanel } from "@/components/analysis/analyze-meal-panel";
import { DetectedFoodsList } from "@/components/analysis/detected-foods-list";
import { NutritionSummary } from "@/components/analysis/nutrition-summary";
import type { Meal } from "@/types/meal";
import type { MealAnalysis } from "@/types/analysis";

interface MealAnalysisViewProps {
  meal: Meal;
  analysis: MealAnalysis | null;
  autoStart?: boolean;
}

export function MealAnalysisView({ meal, analysis, autoStart = false }: MealAnalysisViewProps) {
  const hasDescription = meal.description.trim().length > 0;
  const hasImage = Boolean(meal.imageUrl);

  return (
    <div className="mt-6 space-y-6">
      <AnalyzeMealPanel
        autoStart={autoStart}
        existingAnalysis={analysis}
        hasDescription={hasDescription}
        hasImage={hasImage}
        mealId={meal.id}
      />

      {analysis?.status === "failed" ? (
        <AnalysisErrorState
          message={
            analysis.errorMessage ??
            "The last analysis attempt failed. Try again or update your meal details."
          }
        />
      ) : null}

      {analysis?.status === "completed" ? (
        <>
          <AnalysisSummaryCard analysis={analysis} />
          {analysis.components.length > 0 ? (
            <DetectedFoodsList components={analysis.components} />
          ) : null}
          {analysis.nutrition ? (
            <NutritionSummary nutrition={analysis.nutrition} />
          ) : null}
        </>
      ) : analysis?.status !== "failed" ? (
        <AnalysisPendingState />
      ) : null}
    </div>
  );
}
