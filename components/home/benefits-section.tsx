import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Nutrition estimates for African and diaspora meals",
  "Clear feedback on metabolic impact",
  "Suggestions that fit local ingredients and budgets",
  "Track meals and health trends over time",
  "Works well on mobile",
  "Your health data stays private",
];

export function BenefitsSection() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="mt-12 rounded-2xl border border-border/60 bg-muted/30 px-6 py-8 sm:px-8"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          id="benefits-heading"
        >
          Health guidance that fits your culture
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          AfriMet aims to support better metabolic health without asking you to
          give up the foods you grew up with.
        </p>
      </div>

      <ul className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-2">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5">
            <CheckCircle2
              aria-hidden
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
            />
            <span className="text-sm text-foreground">{benefit}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
