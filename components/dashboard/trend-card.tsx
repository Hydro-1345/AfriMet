import type { TrendPoint } from "@/types/analytics";

interface TrendCardProps {
  title: string;
  description: string;
  points: TrendPoint[];
  unit?: string;
  emptyMessage?: string;
}

export function TrendCard({
  title,
  description,
  points,
  unit,
  emptyMessage = "No trend data for this period yet.",
}: TrendCardProps) {
  const maxValue = points.reduce((max, point) => Math.max(max, point.value), 0);

  return (
    <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      {points.length === 0 || maxValue === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <div className="flex min-w-[280px] items-end gap-2 sm:gap-3">
            {points.map((point) => {
              const heightPercent = maxValue > 0 ? (point.value / maxValue) * 100 : 0;

              return (
                <div
                  className="flex min-w-[2.5rem] flex-1 flex-col items-center gap-2"
                  key={`${point.label}-${point.value}`}
                >
                  <span className="text-xs font-medium text-foreground">
                    {Math.round(point.value)}
                    {unit ? ` ${unit}` : ""}
                  </span>
                  <div className="flex h-28 w-full items-end">
                    <div
                      aria-hidden
                      className="w-full rounded-t-md bg-primary/80"
                      style={{ height: `${Math.max(heightPercent, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{point.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
