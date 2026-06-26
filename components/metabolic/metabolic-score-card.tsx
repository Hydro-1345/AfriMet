import { Activity, Gauge } from "lucide-react";
import {
  getGlycemicImpactLabel,
  getSatietyEstimateLabel,
} from "@/lib/metabolic/queries";
import { SCORE_CATEGORY_BANDS } from "@/lib/metabolic/constants";
import type { MetabolicAssessment } from "@/types/metabolic";

interface MetabolicScoreCardProps {
  assessment: MetabolicAssessment;
}

export function MetabolicScoreCard({ assessment }: MetabolicScoreCardProps) {
  const { score } = assessment;

  return (
    <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Gauge aria-hidden className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground">Metabolic insights</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Interpretive estimates from your stored nutrition analysis.
          </p>
        </div>
      </div>

      {assessment.scorePendingOfficialAlgorithm ? (
        <div className="mt-5 rounded-lg border border-dashed border-border/60 bg-muted/20 px-4 py-3">
          <p className="text-sm font-medium text-foreground">
            Metabolic score (0–100): Pending approved algorithm
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            The Technical Specification defines score categories (
            {SCORE_CATEGORY_BANDS.excellent.label} 90–100,{" "}
            {SCORE_CATEGORY_BANDS.good.label} 75–89,{" "}
            {SCORE_CATEGORY_BANDS.moderate.label} 60–74,{" "}
            {SCORE_CATEGORY_BANDS.needs_improvement.label} below 60), but no
            calculation formula yet. The estimates below are transparent and not
            clinical scores.
          </p>
        </div>
      ) : score.score !== null ? (
        <div className="mt-5 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
          <p className="text-3xl font-bold text-primary">{Math.round(score.score)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {score.scoreCategory
              ? SCORE_CATEGORY_BANDS[score.scoreCategory].label
              : "Score category unavailable"}
          </p>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Activity aria-hidden className="h-4 w-4 text-primary" />
            Glycemic impact estimate
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {getGlycemicImpactLabel(score.glycemicImpact)}
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Activity aria-hidden className="h-4 w-4 text-primary" />
            Satiety estimate
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {getSatietyEstimateLabel(score.satietyEstimate)}
          </p>
        </div>
      </div>

      {score.portionSizeGrams !== null ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Estimated total portion: ~{Math.round(score.portionSizeGrams)} g
        </p>
      ) : null}

      <p className="mt-4 text-sm leading-relaxed text-foreground">
        {score.healthExplanation}
      </p>
    </section>
  );
}
