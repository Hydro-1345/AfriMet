import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/lib/profile/constants";

interface ProfileProgressProps {
  currentStep: number;
  className?: string;
}

export function ProfileProgress({ currentStep, className }: ProfileProgressProps) {
  const progressPercent = Math.round((currentStep / ONBOARDING_STEPS.length) * 100);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          Step {currentStep} of {ONBOARDING_STEPS.length}
        </span>
        <span className="text-muted-foreground">{progressPercent}% complete</span>
      </div>

      <div
        aria-label="Onboarding progress"
        aria-valuemax={ONBOARDING_STEPS.length}
        aria-valuemin={1}
        aria-valuenow={currentStep}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <ol className="grid gap-2 sm:grid-cols-2">
        {ONBOARDING_STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isComplete = step.id < currentStep;

          return (
            <li
              key={step.id}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm transition-colors",
                isActive
                  ? "border-primary/40 bg-primary/5"
                  : isComplete
                    ? "border-border/60 bg-muted/30"
                    : "border-border/40 bg-background"
              )}
            >
              <p
                className={cn(
                  "font-medium",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
