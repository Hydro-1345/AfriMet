"use client";

import Link from "next/link";
import { PendingLinkLabel } from "@/components/ui/pending-link-label";
import { ANALYTICS_PERIODS } from "@/lib/analytics/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AnalyticsPeriod } from "@/types/analytics";

interface AnalyticsPeriodFilterProps {
  currentPeriod: AnalyticsPeriod;
}

function buildDashboardHref(period: AnalyticsPeriod): string {
  if (period === "30d") {
    return "/dashboard";
  }

  return `/dashboard?period=${period}`;
}

function PeriodFilterButton({
  href,
  label,
  isSelected,
}: {
  href: string;
  label: string;
  isSelected: boolean;
}) {
  return (
    <Button
      asChild
      aria-pressed={isSelected}
      size="sm"
      variant={isSelected ? "default" : "outline"}
    >
      <Link href={href}>
        <PendingLinkLabel
          className={cn(isSelected && "font-medium")}
          pendingText="Loading..."
        >
          {label}
        </PendingLinkLabel>
      </Link>
    </Button>
  );
}

export function AnalyticsPeriodFilter({ currentPeriod }: AnalyticsPeriodFilterProps) {
  return (
    <div
      aria-label="Analytics time period"
      className="flex flex-wrap gap-2"
      role="group"
    >
      {ANALYTICS_PERIODS.map((item) => (
        <PeriodFilterButton
          href={buildDashboardHref(item.value)}
          isSelected={currentPeriod === item.value}
          key={item.value}
          label={item.label}
        />
      ))}
    </div>
  );
}
