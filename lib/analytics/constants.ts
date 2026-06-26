import type { AnalyticsPeriod } from "@/types/analytics";

export const ANALYTICS_PERIODS = [
  { value: "7d" as const, label: "Last 7 days" },
  { value: "30d" as const, label: "Last 30 days" },
  { value: "all" as const, label: "All time" },
] satisfies { value: AnalyticsPeriod; label: string }[];

export const DEFAULT_ANALYTICS_PERIOD: AnalyticsPeriod = "30d";

export const GLYCEMIC_DISTRIBUTION_KEYS = ["low", "moderate", "high"] as const;

export const SATIETY_DISTRIBUTION_KEYS = ["low", "moderate", "high"] as const;
