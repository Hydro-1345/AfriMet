import { cn } from "@/lib/utils";
import {
  formatConfidencePercent,
  getConfidenceLevel,
} from "@/lib/analysis/queries";

interface ConfidenceIndicatorProps {
  confidence: number | null;
  label?: string;
  className?: string;
}

const levelStyles = {
  high: "border-primary/30 bg-primary/10 text-primary",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  low: "border-destructive/30 bg-destructive/10 text-destructive",
  unknown: "border-border/60 bg-muted/30 text-muted-foreground",
} as const;

const levelLabels = {
  high: "High confidence",
  medium: "Moderate confidence",
  low: "Low confidence",
  unknown: "Confidence unknown",
} as const;

export function ConfidenceIndicator({
  confidence,
  label = "Overall confidence",
  className,
}: ConfidenceIndicatorProps) {
  const level = getConfidenceLevel(confidence);

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3",
        levelStyles[level],
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-lg font-semibold">{formatConfidencePercent(confidence)}</p>
      <p className="mt-1 text-sm">{levelLabels[level]}</p>
    </div>
  );
}
