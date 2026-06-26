import { cn } from "@/lib/utils";
import {
  getRecommendationTypeLabel,
} from "@/lib/recommendations/generator";
import { RECOMMENDATION_PRIORITY_LABELS } from "@/lib/recommendations/constants";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const priorityStyles = {
  high: "border-primary/40 bg-primary/5",
  medium: "border-border/60 bg-muted/20",
  low: "border-border/60 bg-background",
} as const;

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border p-4 shadow-sm sm:p-5",
        priorityStyles[recommendation.priority]
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
          {getRecommendationTypeLabel(recommendation.recommendationType)}
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {RECOMMENDATION_PRIORITY_LABELS[recommendation.priority]}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground sm:text-base">
        {recommendation.recommendationText}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {recommendation.explanation}
      </p>
    </article>
  );
}
