import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FoodEmptyStateProps {
  title?: string;
  description?: string;
  showClearFilters?: boolean;
  className?: string;
}

export function FoodEmptyState({
  title = "No foods found",
  description = "Try a different search term or clear your filters.",
  showClearFilters = true,
  className,
}: FoodEmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-8 text-center ${className ?? ""}`}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <BookOpen aria-hidden className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      {showClearFilters ? (
        <div className="mt-5">
          <Button asChild variant="outline">
            <Link href="/foods">Clear filters</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
