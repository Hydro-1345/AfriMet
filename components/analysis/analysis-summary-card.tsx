import { format } from "date-fns";
import { ConfidenceIndicator } from "@/components/analysis/confidence-indicator";
import type { MealAnalysis } from "@/types/analysis";

interface AnalysisSummaryCardProps {
  analysis: MealAnalysis;
}

export function AnalysisSummaryCard({ analysis }: AnalysisSummaryCardProps) {
  return (
    <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Analysis summary</h2>
          {analysis.analyzedAt ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Analyzed {format(new Date(analysis.analyzedAt), "EEE, d MMM yyyy 'at' h:mm a")}
            </p>
          ) : null}
        </div>
        <ConfidenceIndicator confidence={analysis.overallConfidence} />
      </div>

      {analysis.analysisNotes ? (
        <p className="mt-5 text-sm leading-relaxed text-foreground sm:text-base">
          {analysis.analysisNotes}
        </p>
      ) : null}
    </section>
  );
}
