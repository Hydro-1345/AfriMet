import { Camera, Globe2, LineChart, Salad, Target } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Meal Photo Analysis",
    description:
      "Upload a photo and get help identifying foods and estimating portions.",
  },
  {
    icon: Globe2,
    title: "African Food Intelligence",
    description:
      "A food database covering jollof rice, fufu, egusi, suya, plantain, and more.",
  },
  {
    icon: Target,
    title: "Metabolic Scoring",
    description:
      "See how a meal may affect blood sugar, satiety, and overall metabolic health.",
  },
  {
    icon: Salad,
    title: "Personalized Recommendations",
    description:
      "Get practical suggestions based on your goals, culture, and budget.",
  },
  {
    icon: LineChart,
    title: "Nutrition Trends",
    description:
      "Follow calories, macros, and metabolic scores over days, weeks, and months.",
  },
];

export function FeaturesSection() {
  return (
    <section aria-labelledby="features-heading" className="mt-12">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          id="features-heading"
        >
          Planned features
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          AfriMet is being built to recognize African foods and explain their
          effect on your metabolism.
        </p>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <li
            key={feature.title}
            className="rounded-xl border border-border/60 bg-card p-5 shadow-sm"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <feature.icon aria-hidden className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {feature.description}
            </p>
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              Coming soon
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
