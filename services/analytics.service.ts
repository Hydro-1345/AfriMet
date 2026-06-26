"use server";

import { fetchDashboardAnalytics } from "@/lib/analytics/queries";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsPeriod, DashboardAnalyticsResult } from "@/types/analytics";

export async function getUserDashboardAnalytics(
  userId: string,
  period: AnalyticsPeriod
): Promise<DashboardAnalyticsResult> {
  const supabase = await createClient();

  try {
    const analytics = await fetchDashboardAnalytics(supabase, userId, period);
    return { analytics };
  } catch (error) {
    console.error("[analytics] Failed to load dashboard analytics:", error);
    return {
      analytics: null,
      error: "Unable to load dashboard analytics. Please try again.",
    };
  }
}
