import type { MealInput } from "@/lib/meals/schemas";

export type Meal = {
  id: string;
  userId: string;
  description: string;
  imageUrl: string | null;
  imageSignedUrl: string | null;
  mealDate: string;
  createdAt: string;
  updatedAt: string;
};

export type MealRow = {
  id: string;
  user_id: string;
  description: string;
  image_url: string | null;
  meal_date: string;
  created_at: string;
  updated_at: string;
};

export type MealSummary = {
  totalCount: number;
  recentMeals: Meal[];
};

export type MealActionResult = {
  error?: string;
  success?: boolean;
  message?: string;
  meal?: Meal;
};

export type MealFormValues = MealInput;
