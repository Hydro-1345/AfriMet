import { Lightbulb } from "lucide-react";
import Link from "next/link";
import { RecommendationCard } from "@/components/recommendations/recommendation-card";
import { Button } from "@/components/ui/button";
import type { MealRecommendations } from "@/types/recommendation";

interface RecommendationsListProps {
  recommendations: MealRecommendations;
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  return (
    <ul className="space-y-3">
      {recommendations.recommendations.map((recommendation) => (
        <li key={recommendation.id}>
          <RecommendationCard recommendation={recommendation} />
        </li>
      ))}
    </ul>
  );
}

interface RecommendationsEmptyStateProps {
  showClearMessage?: boolean;
}

export function RecommendationsEmptyState({
  showClearMessage = true,
}: RecommendationsEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Lightbulb aria-hidden className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">No recommendations yet</p>
      {showClearMessage ? (
        <p className="mt-1.5 text-sm text-muted-foreground">
          Complete nutrition analysis and metabolic insights to generate personalized
          recommendations.
        </p>
      ) : null}
    </div>
  );
}

export function RecommendationsUnavailableState() {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-8 text-center">
      <p className="text-sm font-medium text-foreground">Recommendations unavailable</p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Complete AI meal analysis and metabolic insights first.
      </p>
      <div className="mt-5">
        <Button asChild variant="outline">
          <Link href="/profile">Review your profile</Link>
        </Button>
      </div>
    </div>
  );
}
