import { formatMacro } from "@/lib/analysis/queries";
import type { NutritionRecord } from "@/types/analysis";

interface NutritionSummaryProps {
  nutrition: NutritionRecord;
}

export function NutritionSummary({ nutrition }: NutritionSummaryProps) {
  const items = [
    { label: "Calories", value: formatMacro(nutrition.calories, "kcal") },
    { label: "Protein", value: formatMacro(nutrition.protein) },
    { label: "Carbohydrates", value: formatMacro(nutrition.carbs) },
    { label: "Fat", value: formatMacro(nutrition.fat) },
    { label: "Fibre", value: formatMacro(nutrition.fiber) },
  ];

  return (
    <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">Nutrition summary</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        AI-estimated totals for this meal.
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3"
          >
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {item.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
