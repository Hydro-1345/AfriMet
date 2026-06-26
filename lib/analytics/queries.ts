import type { SupabaseClient } from "@supabase/supabase-js";
import {
  aggregateDashboardAnalytics,
  getPeriodStart,
  type MealAnalyticsRow,
} from "@/lib/analytics/aggregate";
import { fetchUserProfile } from "@/lib/profile/queries";
import type { AnalyticsPeriod, DashboardAnalytics } from "@/types/analytics";

const MEAL_ANALYTICS_SELECT = `
  id,
  meal_date,
  nutrition_records ( calories, protein, carbs, fat, fiber ),
  meal_analyses ( status ),
  metabolic_scores ( glycemic_impact, satiety_estimate, score ),
  recommendations ( id, priority )
`;

export async function fetchDashboardAnalytics(
  supabase: SupabaseClient,
  userId: string,
  period: AnalyticsPeriod
): Promise<DashboardAnalytics> {
  const profile = await fetchUserProfile(supabase, userId);
  const periodStart = getPeriodStart(period);

  let query = supabase
    .from("meals")
    .select(MEAL_ANALYTICS_SELECT)
    .eq("user_id", userId)
    .order("meal_date", { ascending: false });

  if (periodStart) {
    query = query.gte("meal_date", periodStart.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Unable to load dashboard analytics.");
  }

  return aggregateDashboardAnalytics(
    (data ?? []) as MealAnalyticsRow[],
    period,
    profile
  );
}
