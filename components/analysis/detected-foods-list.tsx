import {
  formatConfidencePercent,
  getConfidenceLevel,
} from "@/lib/analysis/queries";
import type { MealComponent } from "@/types/analysis";
import { cn } from "@/lib/utils";

interface DetectedFoodsListProps {
  components: MealComponent[];
}

function confidenceBadgeClass(confidence: number | null): string {
  const level = getConfidenceLevel(confidence);

  return cn(
    "rounded-full px-2 py-0.5 text-xs font-medium",
    level === "high" && "bg-primary/10 text-primary",
    level === "medium" && "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    level === "low" && "bg-destructive/10 text-destructive",
    level === "unknown" && "bg-muted text-muted-foreground"
  );
}

export function DetectedFoodsList({ components }: DetectedFoodsListProps) {
  return (
    <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">Detected foods</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Likely components identified from your meal input.
      </p>
      <ul className="mt-5 space-y-3">
        {components.map((component) => (
          <li
            key={component.id}
            className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-foreground">{component.foodName}</p>
              {component.estimatedWeight !== null ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Estimated serving: ~{Math.round(component.estimatedWeight)} g
                </p>
              ) : null}
            </div>
            <span className={confidenceBadgeClass(component.confidenceScore)}>
              {formatConfidencePercent(component.confidenceScore)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
