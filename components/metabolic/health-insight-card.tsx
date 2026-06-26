import { cn } from "@/lib/utils";
import type { HealthInsight } from "@/types/metabolic";

interface HealthInsightCardProps {
  insight: HealthInsight;
}

const typeStyles = {
  positive: "border-primary/30 bg-primary/5",
  improvement: "border-amber-500/30 bg-amber-500/5",
  observation: "border-border/60 bg-muted/20",
} as const;

const typeLabels = {
  positive: "Positive finding",
  improvement: "Area to improve",
  observation: "Observation",
} as const;

export function HealthInsightCard({ insight }: HealthInsightCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border p-4 shadow-sm sm:p-5",
        typeStyles[insight.insightType]
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {typeLabels[insight.insightType]}
      </p>
      <h3 className="mt-2 text-sm font-semibold text-foreground sm:text-base">
        {insight.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {insight.description}
      </p>
    </article>
  );
}
