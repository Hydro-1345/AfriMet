"use client";

import { MealForm } from "@/components/meals/meal-form";
import { updateMealAndRedirectAction } from "@/lib/meals/actions";
import type { Meal } from "@/types/meal";

interface EditMealFormProps {
  meal: Meal;
}

export function EditMealForm({ meal }: EditMealFormProps) {
  return (
    <MealForm
      meal={meal}
      mode="edit"
      onSubmit={(formData) => updateMealAndRedirectAction(meal.id, formData)}
      pendingLabel="Saving changes..."
      submitLabel="Save changes"
    />
  );
}
