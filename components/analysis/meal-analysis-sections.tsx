"use client";

import { useState } from "react";
import { AnalysisErrorState } from "@/components/analysis/analysis-error-state";
import { AnalysisPendingState } from "@/components/analysis/analysis-pending-state";
import { AnalysisSummaryCard } from "@/components/analysis/analysis-summary-card";
import { AnalyzeMealPanel } from "@/components/analysis/analyze-meal-panel";
import { DetectedFoodsList } from "@/components/analysis/detected-foods-list";
import { NutritionSummary } from "@/components/analysis/nutrition-summary";
import { MetabolicInsightsSection } from "@/components/metabolic/metabolic-insights-section";
import { RecommendationsSection } from "@/components/recommendations/recommendations-section";
import type { Meal } from "@/types/meal";
import type { MealAnalysis } from "@/types/analysis";
import type { MetabolicAssessment } from "@/types/metabolic";
import type { MealRecommendations } from "@/types/recommendation";

interface MealAnalysisSectionsProps {
  meal: Meal;
  analysis: MealAnalysis | null;
  autoStart?: boolean;
  metabolicAssessment?: MetabolicAssessment | null;
  metabolicError?: string | null;
  mealRecommendations?: MealRecommendations | null;
  recommendationsError?: string | null;
}

export function MealAnalysisSections({
  meal,
  analysis,
  autoStart = false,
  metabolicAssessment = null,
  metabolicError = null,
  mealRecommendations = null,
  recommendationsError = null,
}: MealAnalysisSectionsProps) {
  const hasDescription = meal.description.trim().length > 0;
  const hasImage = Boolean(meal.imageUrl);
  const hasCompletedAnalysis = analysis?.status === "completed";
  const [isAnalyzing, setIsAnalyzing] = useState(
    Boolean(autoStart && (hasDescription || hasImage) && !hasCompletedAnalysis)
  );

  return (
    <div className="mt-6 space-y-6">
      <AnalyzeMealPanel
        autoStart={autoStart}
        existingAnalysis={analysis}
        hasDescription={hasDescription}
        hasImage={hasImage}
        mealId={meal.id}
        onPendingChange={setIsAnalyzing}
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
          <RecommendationsSection
            canGenerate={Boolean(analysis.nutrition && metabolicAssessment)}
            errorMessage={recommendationsError}
            initialRecommendations={mealRecommendations}
            mealId={meal.id}
          />
        </>
      ) : analysis?.status !== "failed" ? (
        <AnalysisPendingState isLoading={isAnalyzing} />
      ) : null}
    </div>
  );
}
