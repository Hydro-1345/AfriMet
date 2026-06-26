export type AnalyticsPeriod = "7d" | "30d" | "all";

export type DistributionItem = {
  key: string;
  label: string;
  count: number;
  percentage: number;
};

export type TrendPoint = {
  label: string;
  value: number;
};

export type NutritionAverages = {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fiber: number | null;
};

export type RecommendationCounts = {
  total: number;
  high: number;
  medium: number;
  low: number;
};

export type MacronutrientTrends = {
  protein: TrendPoint[];
  carbs: TrendPoint[];
  fat: TrendPoint[];
};

export type DashboardAnalytics = {
  period: AnalyticsPeriod;
  periodLabel: string;
  totalMealsLogged: number;
  mealsAnalyzed: number;
  mealsWithMetabolic: number;
  nutritionAverages: NutritionAverages;
  todayCalories: number | null;
  glycemicDistribution: DistributionItem[];
  satietyDistribution: DistributionItem[];
  recommendationCounts: RecommendationCounts;
  calorieTrend: TrendPoint[];
  macronutrientTrends: MacronutrientTrends;
  healthSummary: string;
};

export type DashboardAnalyticsResult = {
  analytics: DashboardAnalytics | null;
  error?: string;
};
