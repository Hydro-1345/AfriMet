import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MealEmptyStateProps {
  title?: string;
  description?: string;
  showAddButton?: boolean;
  className?: string;
}

export function MealEmptyState({
  title = "No meals logged yet",
  description = "Start tracking your meals to build your personal history.",
  showAddButton = true,
  className,
}: MealEmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-8 text-center ${className ?? ""}`}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UtensilsCrossed aria-hidden className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      {showAddButton ? (
        <div className="mt-5">
          <Button asChild>
            <Link href="/meals/new">Log your first meal</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
