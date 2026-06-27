"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { PageContainer } from "@/components/layout/page-container";
import { PendingButtonLink } from "@/components/ui/pending-button-link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[app] Route error:", error);
  }, [error]);

  return (
    <PageContainer className="flex max-w-lg flex-col justify-center py-12">
      <ErrorState
        message="An unexpected error occurred while loading this page. You can try again or return to your dashboard."
        onRetry={reset}
        title="Unable to load page"
      />
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <PendingButtonLink href="/dashboard" pendingText="Loading..." variant="outline">
          Go to dashboard
        </PendingButtonLink>
        <PendingButtonLink href="/" pendingText="Loading..." variant="outline">
          Go to home
        </PendingButtonLink>
      </div>
    </PageContainer>
  );
}
