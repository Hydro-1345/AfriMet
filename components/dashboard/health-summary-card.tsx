import { HeartPulse } from "lucide-react";

interface HealthSummaryCardProps {
  summary: string;
}

export function HealthSummaryCard({ summary }: HealthSummaryCardProps) {
  return (
    <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <HeartPulse aria-hidden className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Health summary</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{summary}</p>
        </div>
      </div>
    </section>
  );
}
