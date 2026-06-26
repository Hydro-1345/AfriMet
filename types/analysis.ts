export type AnalysisStatus = "completed" | "failed";

export type MealComponent = {
  id: string;
  mealId: string;
  foodName: string;
  estimatedWeight: number | null;
  confidenceScore: number | null;
  createdAt: string;
};

export type NutritionRecord = {
  mealId: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  createdAt: string;
  updatedAt: string;
};

export type MealAnalysis = {
  id: string;
  mealId: string;
  status: AnalysisStatus;
  analysisNotes: string | null;
  overallConfidence: number | null;
  errorMessage: string | null;
  model: string | null;
  analyzedAt: string | null;
  createdAt: string;
  updatedAt: string;
  components: MealComponent[];
  nutrition: NutritionRecord | null;
};

export type MealAnalysisRow = {
  id: string;
  meal_id: string;
  status: AnalysisStatus;
  analysis_notes: string | null;
  overall_confidence: number | null;
  error_message: string | null;
  model: string | null;
  analyzed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MealComponentRow = {
  id: string;
  meal_id: string;
  food_name: string;
  estimated_weight: number | null;
  confidence_score: number | null;
  created_at: string;
};

export type NutritionRecordRow = {
  meal_id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  created_at: string;
  updated_at: string;
};

export type AnalysisActionResult = {
  error?: string;
  success?: boolean;
  message?: string;
  analysis?: MealAnalysis;
  cached?: boolean;
};
