import { Sparkles } from "lucide-react";

interface AnalysisPendingStateProps {
  title?: string;
  description?: string;
}

export function AnalysisPendingState({
  title = "No analysis yet",
  description = "Run AI analysis to estimate foods and nutrition for this meal.",
}: AnalysisPendingStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles aria-hidden className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
