import {
  Apple,
  Beef,
  Droplets,
  Flame,
  Leaf,
  Lightbulb,
  Salad,
  UtensilsCrossed,
} from "lucide-react";
import { AnalyticsPeriodFilter } from "@/components/dashboard/analytics-period-filter";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DistributionCard } from "@/components/dashboard/distribution-card";
import { HealthSummaryCard } from "@/components/dashboard/health-summary-card";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { TrendCard } from "@/components/dashboard/trend-card";
import { formatAnalyticsNumber } from "@/lib/analytics/format";
import type { DashboardAnalytics } from "@/types/analytics";

interface DashboardAnalyticsSectionProps {
  analytics: DashboardAnalytics;
}

export function DashboardAnalyticsSection({
  analytics,
}: DashboardAnalyticsSectionProps) {
  const hasAnalyzedMeals = analytics.mealsAnalyzed > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Your analytics</h2>
          <p className="text-sm text-muted-foreground">
            Aggregated from stored meals, nutrition, metabolic scores, and
            recommendations — {analytics.periodLabel.toLowerCase()}.
          </p>
        </div>
        <AnalyticsPeriodFilter currentPeriod={analytics.period} />
      </div>

      <HealthSummaryCard summary={analytics.healthSummary} />

      {!hasAnalyzedMeals && analytics.totalMealsLogged === 0 ? (
        <DashboardEmptyState />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatisticCard
              description={`${analytics.periodLabel.toLowerCase()}`}
              icon={UtensilsCrossed}
              label="Meals logged"
              value={analytics.totalMealsLogged.toString()}
            />
            <StatisticCard
              description={
                analytics.mealsWithMetabolic > 0
                  ? `${analytics.mealsWithMetabolic} with metabolic scores`
                  : "Completed AI analysis"
              }
              icon={Salad}
              label="Meals analyzed"
              value={analytics.mealsAnalyzed.toString()}
            />
            <StatisticCard
              description="From analyzed meals"
              icon={Flame}
              label="Avg calories"
              value={formatAnalyticsNumber(analytics.nutritionAverages.calories, "kcal")}
            />
            <StatisticCard
              description="Analyzed meals today"
              icon={Flame}
              label="Today's calories"
              value={formatAnalyticsNumber(analytics.todayCalories, "kcal")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatisticCard
              icon={Beef}
              label="Avg protein"
              value={formatAnalyticsNumber(analytics.nutritionAverages.protein, "g")}
            />
            <StatisticCard
              icon={Apple}
              label="Avg carbohydrates"
              value={formatAnalyticsNumber(analytics.nutritionAverages.carbs, "g")}
            />
            <StatisticCard
              icon={Droplets}
              label="Avg fat"
              value={formatAnalyticsNumber(analytics.nutritionAverages.fat, "g")}
            />
            <StatisticCard
              icon={Leaf}
              label="Avg fibre"
              value={formatAnalyticsNumber(analytics.nutritionAverages.fiber, "g")}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <DistributionCard
              description="From stored metabolic scores for analyzed meals."
              items={analytics.glycemicDistribution}
              title="Glycemic impact distribution"
            />
            <DistributionCard
              description="From stored satiety estimates for analyzed meals."
              items={analytics.satietyDistribution}
              title="Satiety distribution"
            />
          </div>

          <StatisticCard
            description={`${analytics.recommendationCounts.high} high · ${analytics.recommendationCounts.medium} medium · ${analytics.recommendationCounts.low} low priority`}
            icon={Lightbulb}
            label="Recommendations generated"
            value={analytics.recommendationCounts.total.toString()}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <TrendCard
              description={
                analytics.period === "7d"
                  ? "Daily calorie totals from analyzed meals."
                  : analytics.period === "30d"
                    ? "Weekly calorie totals from analyzed meals."
                    : "Monthly calorie totals from analyzed meals."
              }
              points={analytics.calorieTrend}
              title="Calorie trend"
              unit="kcal"
            />
            <TrendCard
              description="Average protein per bucket from analyzed meals."
              points={analytics.macronutrientTrends.protein}
              title="Protein trend"
              unit="g"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TrendCard
              description="Average carbohydrates per bucket from analyzed meals."
              points={analytics.macronutrientTrends.carbs}
              title="Carbohydrate trend"
              unit="g"
            />
            <TrendCard
              description="Average fat per bucket from analyzed meals."
              points={analytics.macronutrientTrends.fat}
              title="Fat trend"
              unit="g"
            />
          </div>
        </>
      )}
    </div>
  );
}
