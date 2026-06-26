import type { NutrientInterpretation } from "@/types/metabolic";

interface NutrientInterpretationListProps {
  interpretations: NutrientInterpretation[];
}

export function NutrientInterpretationList({
  interpretations,
}: NutrientInterpretationListProps) {
  return (
    <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">Nutrient interpretation</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Transparent assessments derived from stored nutrition data.
      </p>
      <dl className="mt-5 space-y-4">
        {interpretations.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3"
          >
            <dt className="text-sm font-medium text-foreground">
              {item.label} · {item.value}
            </dt>
            <dd className="mt-1.5 text-sm text-muted-foreground">{item.assessment}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
