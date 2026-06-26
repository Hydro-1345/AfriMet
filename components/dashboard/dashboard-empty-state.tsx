import { BarChart3 } from "lucide-react";
import { PendingButtonLink } from "@/components/ui/pending-button-link";

export function DashboardEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-10 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <BarChart3 aria-hidden className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">
        No analytics data yet
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Log and analyze meals to populate your nutrition and metabolic dashboard.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <PendingButtonLink href="/meals/new" pendingText="Opening..." size="sm">
          Log meal
        </PendingButtonLink>
        <PendingButtonLink href="/meals" pendingText="Loading..." size="sm" variant="outline">
          View meals
        </PendingButtonLink>
      </div>
    </div>
  );
}
