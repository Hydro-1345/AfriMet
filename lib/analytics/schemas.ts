import { z } from "zod";

export const analyticsPeriodSchema = z.object({
  period: z.enum(["7d", "30d", "all"]).default("30d"),
});

export type AnalyticsPeriodParams = z.infer<typeof analyticsPeriodSchema>;
