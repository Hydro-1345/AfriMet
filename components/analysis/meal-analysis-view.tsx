import { MealAnalysisSections } from "@/components/analysis/meal-analysis-sections";
import type { Meal } from "@/types/meal";
import type { MealAnalysis } from "@/types/analysis";
import type { MetabolicAssessment } from "@/types/metabolic";
import type { MealRecommendations } from "@/types/recommendation";

interface MealAnalysisViewProps {
  meal: Meal;
  analysis: MealAnalysis | null;
  autoStart?: boolean;
  metabolicAssessment?: MetabolicAssessment | null;
  metabolicError?: string | null;
  mealRecommendations?: MealRecommendations | null;
  recommendationsError?: string | null;
}

export function MealAnalysisView(props: MealAnalysisViewProps) {
  return <MealAnalysisSections {...props} />;
}
