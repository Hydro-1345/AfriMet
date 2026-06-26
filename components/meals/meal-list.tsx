import { MealCard } from "@/components/meals/meal-card";
import { MealEmptyState } from "@/components/meals/meal-empty-state";
import type { Meal } from "@/types/meal";

interface MealListProps {
  meals: Meal[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function MealList({
  meals,
  emptyTitle,
  emptyDescription,
}: MealListProps) {
  if (meals.length === 0) {
    return (
      <MealEmptyState
        description={emptyDescription}
        title={emptyTitle}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealCard meal={meal} />
        </li>
      ))}
    </ul>
  );
}
