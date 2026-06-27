"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { PageContainer } from "@/components/layout/page-container";
import { PendingButtonLink } from "@/components/ui/pending-button-link";

interface MealsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MealsError({ error, reset }: MealsErrorProps) {
  useEffect(() => {
    console.error("[meals] Route error:", error);
  }, [error]);

  return (
    <PageContainer className="py-6 sm:py-8">
      <ErrorState
        message="We could not load your meal history. Please try again."
        onRetry={reset}
        title="Meals unavailable"
      />
      <div className="mt-6">
        <PendingButtonLink href="/dashboard" pendingText="Loading..." variant="outline">
          Back to dashboard
        </PendingButtonLink>
      </div>
    </PageContainer>
  );
}
