import Link from "next/link";
import { MealCard } from "@/components/meals/meal-card";
import { MealEmptyState } from "@/components/meals/meal-empty-state";
import { Button } from "@/components/ui/button";
import type { Meal } from "@/types/meal";

interface RecentMealsProps {
  meals: Meal[];
  totalCount: number;
}

export function RecentMeals({ meals, totalCount }: RecentMealsProps) {
  return (
    <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Recent meals</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalCount === 0
              ? "No meals logged yet."
              : `${totalCount} meal${totalCount === 1 ? "" : "s"} logged in total.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/meals/new">Log meal</Link>
          </Button>
          {totalCount > 0 ? (
            <Button asChild size="sm" variant="outline">
              <Link href="/meals">View history</Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        {meals.length === 0 ? (
          <MealEmptyState showAddButton={false} />
        ) : (
          <ul className="space-y-3">
            {meals.map((meal) => (
              <li key={meal.id}>
                <MealCard meal={meal} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
