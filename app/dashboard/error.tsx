"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { PageContainer } from "@/components/layout/page-container";
import { PendingButtonLink } from "@/components/ui/pending-button-link";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("[dashboard] Route error:", error);
  }, [error]);

  return (
    <PageContainer className="py-6 sm:py-8">
      <ErrorState
        message="We could not load your dashboard analytics. Your data is still safe — try refreshing the page."
        onRetry={reset}
        title="Dashboard unavailable"
      />
      <div className="mt-6 flex flex-wrap gap-2">
        <PendingButtonLink href="/meals" pendingText="Loading..." variant="outline">
          View meals
        </PendingButtonLink>
      </div>
    </PageContainer>
  );
}
