import {
  GLYCEMIC_IMPACT_LABELS,
  SATIETY_ESTIMATE_LABELS,
} from "@/lib/metabolic/constants";
import {
  ANALYTICS_PERIODS,
  GLYCEMIC_DISTRIBUTION_KEYS,
  SATIETY_DISTRIBUTION_KEYS,
} from "@/lib/analytics/constants";
import type {
  AnalyticsPeriod,
  DashboardAnalytics,
  DistributionItem,
  MacronutrientTrends,
  NutritionAverages,
  RecommendationCounts,
  TrendPoint,
} from "@/types/analytics";
import type { UserProfile } from "@/types/profile";

type GlycemicLevel = (typeof GLYCEMIC_DISTRIBUTION_KEYS)[number];
type SatietyLevel = (typeof SATIETY_DISTRIBUTION_KEYS)[number];

type MealAnalyticsRow = {
  id: string;
  meal_date: string;
  nutrition_records:
    | {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
      }
    | {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
      }[]
    | null;
  meal_analyses: { status: string } | { status: string }[] | null;
  metabolic_scores:
    | {
        glycemic_impact: GlycemicLevel;
        satiety_estimate: SatietyLevel;
        score: number | null;
      }
    | {
        glycemic_impact: GlycemicLevel;
        satiety_estimate: SatietyLevel;
        score: number | null;
      }[]
    | null;
  recommendations: { id: string; priority: string }[] | null;
};

type AnalyzedMeal = {
  id: string;
  mealDate: Date;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  glycemicImpact: GlycemicLevel | null;
  satietyEstimate: SatietyLevel | null;
  recommendationCount: number;
  recommendationPriorities: string[];
};

function unwrapRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function getPeriodStart(period: AnalyticsPeriod): Date | null {
  if (period === "all") {
    return null;
  }

  const days = period === "7d" ? 7 : 30;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return start;
}

function getPeriodLabel(period: AnalyticsPeriod): string {
  return ANALYTICS_PERIODS.find((item) => item.value === period)?.label ?? "All time";
}

function isSameUtcDate(left: Date, right: Date): boolean {
  return (
    left.getUTCFullYear() === right.getUTCFullYear() &&
    left.getUTCMonth() === right.getUTCMonth() &&
    left.getUTCDate() === right.getUTCDate()
  );
}

function average(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round((total / values.length) * 10) / 10;
}

function buildDistribution(
  counts: Record<string, number>,
  keys: readonly string[],
  labels: Record<string, string>
): DistributionItem[] {
  const total = keys.reduce((sum, key) => sum + (counts[key] ?? 0), 0);

  return keys.map((key) => {
    const count = counts[key] ?? 0;
    return {
      key,
      label: labels[key] ?? key,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });
}

function normalizeRows(rows: MealAnalyticsRow[]): AnalyzedMeal[] {
  const analyzed: AnalyzedMeal[] = [];

  for (const row of rows) {
    const analysis = unwrapRelation(row.meal_analyses);
    const nutrition = unwrapRelation(row.nutrition_records);

    if (analysis?.status !== "completed" || !nutrition) {
      continue;
    }

    const metabolic = unwrapRelation(row.metabolic_scores);

    analyzed.push({
      id: row.id,
      mealDate: new Date(row.meal_date),
      nutrition: {
        calories: Number(nutrition.calories),
        protein: Number(nutrition.protein),
        carbs: Number(nutrition.carbs),
        fat: Number(nutrition.fat),
        fiber: Number(nutrition.fiber),
      },
      glycemicImpact: metabolic?.glycemic_impact ?? null,
      satietyEstimate: metabolic?.satiety_estimate ?? null,
      recommendationCount: row.recommendations?.length ?? 0,
      recommendationPriorities:
        row.recommendations?.map((item) => item.priority) ?? [],
    });
  }

  return analyzed;
}

function buildCalorieTrend(
  period: AnalyticsPeriod,
  analyzedMeals: AnalyzedMeal[]
): TrendPoint[] {
  if (analyzedMeals.length === 0) {
    return [];
  }

  if (period === "7d") {
    const start = getPeriodStart("7d")!;
    const points: TrendPoint[] = [];

    for (let index = 0; index < 7; index += 1) {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      const label = day.toLocaleDateString(undefined, { weekday: "short" });
      const value = analyzedMeals
        .filter((meal) => isSameUtcDate(meal.mealDate, day))
        .reduce((sum, meal) => sum + meal.nutrition.calories, 0);

      points.push({ label, value: Math.round(value) });
    }

    return points;
  }

  if (period === "30d") {
    const start = getPeriodStart("30d")!;
    const points: TrendPoint[] = [];

    for (let week = 0; week < 5; week += 1) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + week * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const value = analyzedMeals
        .filter(
          (meal) => meal.mealDate >= weekStart && meal.mealDate <= weekEnd
        )
        .reduce((sum, meal) => sum + meal.nutrition.calories, 0);

      points.push({
        label: `W${week + 1}`,
        value: Math.round(value),
      });
    }

    return points;
  }

  const monthMap = new Map<string, number>();

  for (const meal of analyzedMeals) {
    const key = `${meal.mealDate.getUTCFullYear()}-${meal.mealDate.getUTCMonth()}`;
    monthMap.set(key, (monthMap.get(key) ?? 0) + meal.nutrition.calories);
  }

  return Array.from(monthMap.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-6)
    .map(([key, value]) => {
      const [year, month] = key.split("-").map(Number);
      const label = new Date(Date.UTC(year, month, 1)).toLocaleDateString(
        undefined,
        { month: "short", year: "2-digit" }
      );
      return { label, value: Math.round(value) };
    });
}

function buildMacronutrientTrends(
  period: AnalyticsPeriod,
  analyzedMeals: AnalyzedMeal[]
): MacronutrientTrends {
  const buildForMetric = (
    selector: (meal: AnalyzedMeal) => number
  ): TrendPoint[] => {
    if (analyzedMeals.length === 0) {
      return [];
    }

    if (period === "7d") {
      const start = getPeriodStart("7d")!;
      const points: TrendPoint[] = [];

      for (let index = 0; index < 7; index += 1) {
        const day = new Date(start);
        day.setDate(start.getDate() + index);
        const dayMeals = analyzedMeals.filter((meal) =>
          isSameUtcDate(meal.mealDate, day)
        );
        const label = day.toLocaleDateString(undefined, { weekday: "short" });
        points.push({
          label,
          value: average(dayMeals.map(selector)) ?? 0,
        });
      }

      return points;
    }

    if (period === "30d") {
      const start = getPeriodStart("30d")!;
      const points: TrendPoint[] = [];

      for (let week = 0; week < 5; week += 1) {
        const weekStart = new Date(start);
        weekStart.setDate(start.getDate() + week * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const weekMeals = analyzedMeals.filter(
          (meal) => meal.mealDate >= weekStart && meal.mealDate <= weekEnd
        );

        points.push({
          label: `W${week + 1}`,
          value: average(weekMeals.map(selector)) ?? 0,
        });
      }

      return points;
    }

    const monthMap = new Map<string, number[]>();

    for (const meal of analyzedMeals) {
      const key = `${meal.mealDate.getUTCFullYear()}-${meal.mealDate.getUTCMonth()}`;
      const values = monthMap.get(key) ?? [];
      values.push(selector(meal));
      monthMap.set(key, values);
    }

    return Array.from(monthMap.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .slice(-6)
      .map(([key, values]) => {
        const [year, month] = key.split("-").map(Number);
        const label = new Date(Date.UTC(year, month, 1)).toLocaleDateString(
          undefined,
          { month: "short", year: "2-digit" }
        );
        return { label, value: average(values) ?? 0 };
      });
  };

  return {
    protein: buildForMetric((meal) => meal.nutrition.protein),
    carbs: buildForMetric((meal) => meal.nutrition.carbs),
    fat: buildForMetric((meal) => meal.nutrition.fat),
  };
}

function buildRecommendationCounts(analyzedMeals: AnalyzedMeal[]): RecommendationCounts {
  const counts: RecommendationCounts = {
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const meal of analyzedMeals) {
    counts.total += meal.recommendationCount;

    for (const priority of meal.recommendationPriorities) {
      if (priority === "high") {
        counts.high += 1;
      } else if (priority === "medium") {
        counts.medium += 1;
      } else if (priority === "low") {
        counts.low += 1;
      }
    }
  }

  return counts;
}

function buildNutritionAverages(analyzedMeals: AnalyzedMeal[]): NutritionAverages {
  return {
    calories: average(analyzedMeals.map((meal) => meal.nutrition.calories)),
    protein: average(analyzedMeals.map((meal) => meal.nutrition.protein)),
    carbs: average(analyzedMeals.map((meal) => meal.nutrition.carbs)),
    fat: average(analyzedMeals.map((meal) => meal.nutrition.fat)),
    fiber: average(analyzedMeals.map((meal) => meal.nutrition.fiber)),
  };
}

function buildHealthSummary(input: {
  periodLabel: string;
  totalMealsLogged: number;
  mealsAnalyzed: number;
  nutritionAverages: NutritionAverages;
  glycemicDistribution: DistributionItem[];
  satietyDistribution: DistributionItem[];
  recommendationCounts: RecommendationCounts;
  profile: UserProfile | null;
}): string {
  const {
    periodLabel,
    totalMealsLogged,
    mealsAnalyzed,
    nutritionAverages,
    glycemicDistribution,
    satietyDistribution,
    recommendationCounts,
    profile,
  } = input;

  if (totalMealsLogged === 0) {
    return "You have not logged any meals yet. Start by logging a meal to unlock nutrition and metabolic analytics.";
  }

  if (mealsAnalyzed === 0) {
    return `You have logged ${totalMealsLogged} meal${totalMealsLogged === 1 ? "" : "s"} in ${periodLabel.toLowerCase()}, but none have completed AI analysis yet. Analyze a meal to populate your dashboard.`;
  }

  const parts: string[] = [
    `Across ${periodLabel.toLowerCase()}, you analyzed ${mealsAnalyzed} meal${mealsAnalyzed === 1 ? "" : "s"}.`,
  ];

  if (nutritionAverages.calories !== null) {
    parts.push(
      `Average calories per analyzed meal: ${Math.round(nutritionAverages.calories)} kcal.`
    );
  }

  const highGlycemic = glycemicDistribution.find((item) => item.key === "high")?.count ?? 0;

  if (highGlycemic > 0) {
    parts.push(
      `${highGlycemic} meal${highGlycemic === 1 ? "" : "s"} had a higher estimated glycemic load based on stored metabolic scores.`
    );
  }

  const lowSatiety = satietyDistribution.find((item) => item.key === "low")?.count ?? 0;

  if (lowSatiety > 0) {
    parts.push(
      `${lowSatiety} analyzed meal${lowSatiety === 1 ? "" : "s"} had a lower estimated satiety profile.`
    );
  }

  if (
    nutritionAverages.fiber !== null &&
    nutritionAverages.fiber < 5
  ) {
    parts.push(
      `Average fibre per analyzed meal is ${Math.round(nutritionAverages.fiber)} g, which is relatively low.`
    );
  }

  if (recommendationCounts.total > 0) {
    parts.push(
      `${recommendationCounts.total} personalized recommendation${recommendationCounts.total === 1 ? "" : "s"} were generated from your stored analysis.`
    );
  }

  if (profile?.goalType === "weight_loss") {
    parts.push("Your profile goal is weight loss — portion and satiety patterns may be especially useful to review.");
  } else if (profile?.goalType === "weight_gain") {
    parts.push("Your profile goal is weight gain — calorie and protein averages can help track progress.");
  }

  if (profile?.diabetesStatus === "yes") {
    parts.push("Because diabetes is noted in your profile, glycemic distribution trends are worth monitoring over time.");
  }

  return parts.join(" ");
}

export function aggregateDashboardAnalytics(
  rows: MealAnalyticsRow[],
  period: AnalyticsPeriod,
  profile: UserProfile | null
): DashboardAnalytics {
  const analyzedMeals = normalizeRows(rows);
  const mealsAnalyzed = analyzedMeals.length;
  const mealsWithMetabolic = analyzedMeals.filter(
    (meal) => meal.glycemicImpact !== null
  ).length;

  const glycemicCounts: Record<string, number> = {};
  const satietyCounts: Record<string, number> = {};

  for (const meal of analyzedMeals) {
    if (meal.glycemicImpact) {
      glycemicCounts[meal.glycemicImpact] =
        (glycemicCounts[meal.glycemicImpact] ?? 0) + 1;
    }

    if (meal.satietyEstimate) {
      satietyCounts[meal.satietyEstimate] =
        (satietyCounts[meal.satietyEstimate] ?? 0) + 1;
    }
  }

  const nutritionAverages = buildNutritionAverages(analyzedMeals);
  const today = new Date();
  const todayMeals = analyzedMeals.filter((meal) =>
    isSameUtcDate(meal.mealDate, today)
  );
  const todayCalories =
    todayMeals.length > 0
      ? Math.round(
          todayMeals.reduce((sum, meal) => sum + meal.nutrition.calories, 0)
        )
      : null;

  const glycemicDistribution = buildDistribution(
    glycemicCounts,
    GLYCEMIC_DISTRIBUTION_KEYS,
    GLYCEMIC_IMPACT_LABELS
  );
  const satietyDistribution = buildDistribution(
    satietyCounts,
    SATIETY_DISTRIBUTION_KEYS,
    SATIETY_ESTIMATE_LABELS
  );
  const recommendationCounts = buildRecommendationCounts(analyzedMeals);
  const periodLabel = getPeriodLabel(period);

  return {
    period,
    periodLabel,
    totalMealsLogged: rows.length,
    mealsAnalyzed,
    mealsWithMetabolic,
    nutritionAverages,
    todayCalories,
    glycemicDistribution,
    satietyDistribution,
    recommendationCounts,
    calorieTrend: buildCalorieTrend(period, analyzedMeals),
    macronutrientTrends: buildMacronutrientTrends(period, analyzedMeals),
    healthSummary: buildHealthSummary({
      periodLabel,
      totalMealsLogged: rows.length,
      mealsAnalyzed,
      nutritionAverages,
      glycemicDistribution,
      satietyDistribution,
      recommendationCounts,
      profile,
    }),
  };
}

export { getPeriodStart, getPeriodLabel };

export type { MealAnalyticsRow };
