import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisPendingStateProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function AnalysisPendingState({
  title = "No analysis yet",
  description = "Run AI analysis to estimate foods and nutrition for this meal.",
  isLoading = false,
}: AnalysisPendingStateProps) {
  return (
    <div
      aria-busy={isLoading}
      aria-live={isLoading ? "polite" : undefined}
      className={cn(
        "rounded-xl border px-6 py-8 text-center",
        isLoading
          ? "border-border/60 bg-card shadow-sm"
          : "border-dashed border-border/60 bg-muted/20"
      )}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {isLoading ? (
          <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
        ) : (
          <Sparkles aria-hidden className="h-5 w-5" />
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">
        {isLoading ? "Analyzing meal..." : title}
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {isLoading
          ? "Running AI analysis. This may take up to a minute..."
          : description}
      </p>
    </div>
  );
}
