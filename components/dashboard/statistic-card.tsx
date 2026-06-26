import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatisticCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  description?: string;
  className?: string;
}

export function StatisticCard({
  icon: Icon,
  label,
  value,
  description,
  className,
}: StatisticCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border border-border/60 bg-card p-4 shadow-sm sm:p-5",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon aria-hidden className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {description ? (
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
