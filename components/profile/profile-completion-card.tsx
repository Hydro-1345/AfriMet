import { CheckCircle2, CircleDashed, UserCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  getMissingProfileFields,
  getProfileCompletionPercent,
  isProfileComplete,
} from "@/lib/profile/completion";
import type { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";

interface ProfileCompletionCardProps {
  profile: UserProfile | null;
  className?: string;
}

export function ProfileCompletionCard({
  profile,
  className,
}: ProfileCompletionCardProps) {
  const complete = isProfileComplete(profile);
  const percent = getProfileCompletionPercent(profile);
  const missingFields = getMissingProfileFields(profile);

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            complete ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          {complete ? (
            <CheckCircle2 aria-hidden className="h-5 w-5" />
          ) : (
            <CircleDashed aria-hidden className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">
            Profile {complete ? "complete" : "incomplete"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {complete
              ? "Your health profile is ready for meal analysis and recommendations."
              : "Complete your profile so AfriMet can personalise metabolic guidance."}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Completion</span>
          <span className="text-muted-foreground">{percent}%</span>
        </div>
        <div
          aria-label="Profile completion"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={percent}
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all",
              complete ? "bg-primary" : "bg-primary/70"
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {!complete && missingFields.length > 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Still needed: {missingFields.join(", ")}.
        </p>
      ) : null}

      <div className="mt-5">
        <Button asChild variant={complete ? "outline" : "default"}>
          <Link href={complete ? "/profile" : "/onboarding"}>
            <UserCircle aria-hidden className="h-4 w-4" />
            {complete ? "Edit profile" : "Complete profile"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
