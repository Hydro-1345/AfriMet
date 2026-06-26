"use client";

import { MealForm } from "@/components/meals/meal-form";
import { createMealAndRedirectAction } from "@/lib/meals/actions";

export function AddMealForm() {
  return (
    <MealForm
      mode="create"
      onSubmit={createMealAndRedirectAction}
      pendingLabel="Saving meal..."
      submitLabel="Log meal"
    />
  );
}
