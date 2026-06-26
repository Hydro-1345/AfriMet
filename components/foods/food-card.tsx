import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getFoodRegionLabel } from "@/lib/foods/format";
import type { Food } from "@/types/food";

interface FoodCardProps {
  food: Food;
}

export function FoodCard({ food }: FoodCardProps) {
  return (
    <Link
      className="group flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-muted/20 sm:p-5"
      href={`/foods/${food.slug}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground group-hover:text-primary">
            {food.name}
          </p>
          {food.isDiaspora ? (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              Diaspora
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {food.categoryName} · {getFoodRegionLabel(food.region)}
        </p>
        {food.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {food.description}
          </p>
        ) : null}
        {food.aliases.length > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Also known as: {food.aliases.slice(0, 3).join(", ")}
            {food.aliases.length > 3 ? "…" : ""}
          </p>
        ) : null}
      </div>
      <ChevronRight
        aria-hidden
        className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}
