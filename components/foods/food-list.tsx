import { FoodCard } from "@/components/foods/food-card";
import { FoodEmptyState } from "@/components/foods/food-empty-state";
import type { Food } from "@/types/food";

interface FoodListProps {
  foods: Food[];
  hasActiveFilters?: boolean;
}

export function FoodList({ foods, hasActiveFilters = false }: FoodListProps) {
  if (foods.length === 0) {
    return (
      <FoodEmptyState
        description={
          hasActiveFilters
            ? "Try a different search term or clear your filters."
            : "The food library is being prepared. Check back shortly."
        }
        showClearFilters={hasActiveFilters}
        title={hasActiveFilters ? "No foods found" : "No foods available"}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {foods.map((food) => (
        <li key={food.id}>
          <FoodCard food={food} />
        </li>
      ))}
    </ul>
  );
}
