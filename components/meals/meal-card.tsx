"use client";

import Image from "next/image";
import Link from "next/link";
import { useLinkStatus } from "next/link";
import { ChevronRight, ImageIcon, Loader2 } from "lucide-react";
import {
  formatMealDateShort,
  hasMealImage,
  truncateDescription,
} from "@/lib/meals/format";
import { cn } from "@/lib/utils";
import type { Meal } from "@/types/meal";

interface MealCardProps {
  meal: Meal;
  showChevron?: boolean;
}

function MealCardPendingFeedback() {
  const { pending } = useLinkStatus();

  if (!pending) {
    return null;
  }

  return (
    <>
      <span className="sr-only">Opening meal...</span>
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/70"
      >
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    </>
  );
}

export function MealCard({ meal, showChevron = true }: MealCardProps) {
  return (
    <Link
      className={cn(
        "group relative flex items-start gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-opacity transition-colors hover:border-primary/30 hover:bg-muted/20 sm:p-5"
      )}
      href={`/meals/${meal.id}`}
    >
      <MealCardPendingFeedback />

      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/40">
        {hasMealImage(meal) ? (
          <Image
            alt=""
            className="h-full w-full object-cover"
            height={64}
            src={meal.imageSignedUrl!}
            width={64}
          />
        ) : (
          <ImageIcon aria-hidden className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground group-hover:text-primary">
          {truncateDescription(meal.description)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatMealDateShort(meal.mealDate)}
        </p>
      </div>

      {showChevron ? (
        <ChevronRight
          aria-hidden
          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        />
      ) : null}
    </Link>
  );
}
