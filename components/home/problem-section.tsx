import { AlertTriangle } from "lucide-react";

const problems = [
  {
    title: "Western-centric food databases",
    description:
      "Most nutrition apps focus on foods common in Europe and North America. African dishes are often missing or poorly listed.",
  },
  {
    title: "Inaccurate estimates for mixed meals",
    description:
      "Plates like jollof rice with plantain, or amala with ewedu and goat meat, are often miscategorized or skipped.",
  },
  {
    title: "Advice that does not fit your diet",
    description:
      "Generic recommendations rarely account for local ingredients, eating habits, or what meals cost where you live.",
  },
];

export function ProblemSection() {
  return (
    <section aria-labelledby="problem-heading" className="mt-12">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          id="problem-heading"
        >
          Nutrition apps were not built for African foods
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          When apps misunderstand everyday meals, calorie counts are wrong and
          health advice misses the mark.
        </p>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem) => (
          <li
            key={problem.title}
            className="rounded-xl border border-border/60 bg-card p-5 shadow-sm"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle aria-hidden className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-foreground">{problem.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {problem.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
