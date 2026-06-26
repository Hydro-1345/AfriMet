import { AnalysisErrorState } from "@/components/analysis/analysis-error-state";
import { AnalysisPendingState } from "@/components/analysis/analysis-pending-state";
import { AnalysisSummaryCard } from "@/components/analysis/analysis-summary-card";
import { AnalyzeMealPanel } from "@/components/analysis/analyze-meal-panel";
import { DetectedFoodsList } from "@/components/analysis/detected-foods-list";
import { NutritionSummary } from "@/components/analysis/nutrition-summary";
import { MetabolicInsightsSection } from "@/components/metabolic/metabolic-insights-section";
import type { Meal } from "@/types/meal";
import type { MealAnalysis } from "@/types/analysis";
import type { MetabolicAssessment } from "@/types/metabolic";

interface MealAnalysisViewProps {
  meal: Meal;
  analysis: MealAnalysis | null;
  autoStart?: boolean;
  metabolicAssessment?: MetabolicAssessment | null;
  metabolicError?: string | null;
}

export function MealAnalysisView({
  meal,
  analysis,
  autoStart = false,
  metabolicAssessment = null,
  metabolicError = null,
}: MealAnalysisViewProps) {
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
          <MetabolicInsightsSection
            canGenerate={Boolean(analysis.nutrition)}
            errorMessage={metabolicError}
            initialAssessment={metabolicAssessment}
            mealId={meal.id}
          />
        </>
      ) : analysis?.status !== "failed" ? (
        <AnalysisPendingState />
      ) : null}
    </div>
  );
}
