import type { DistributionItem } from "@/types/analytics";

interface DistributionCardProps {
  title: string;
  description: string;
  items: DistributionItem[];
  emptyMessage?: string;
}

export function DistributionCard({
  title,
  description,
  items,
  emptyMessage = "No data for this period yet.",
}: DistributionCardProps) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      {total === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li key={item.key}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-muted-foreground">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
              <div
                aria-hidden
                className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
