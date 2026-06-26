import { HealthInsightCard } from "@/components/metabolic/health-insight-card";
import type { HealthInsight } from "@/types/metabolic";

interface HealthInsightsListProps {
  insights: HealthInsight[];
}

export function HealthInsightsList({ insights }: HealthInsightsListProps) {
  const positive = insights.filter((insight) => insight.insightType === "positive");
  const improvements = insights.filter(
    (insight) => insight.insightType === "improvement"
  );
  const observations = insights.filter(
    (insight) => insight.insightType === "observation"
  );

  return (
    <section className="space-y-6">
      {positive.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-foreground">Positive findings</h2>
          <ul className="mt-4 space-y-3">
            {positive.map((insight) => (
              <li key={insight.id}>
                <HealthInsightCard insight={insight} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {improvements.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-foreground">Areas to improve</h2>
          <ul className="mt-4 space-y-3">
            {improvements.map((insight) => (
              <li key={insight.id}>
                <HealthInsightCard insight={insight} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {observations.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-foreground">Observations</h2>
          <ul className="mt-4 space-y-3">
            {observations.map((insight) => (
              <li key={insight.id}>
                <HealthInsightCard insight={insight} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
