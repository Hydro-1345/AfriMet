import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PendingButtonLink } from "@/components/ui/pending-button-link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you requested could not be found.",
};

export default function NotFoundPage() {
  return (
    <PageContainer className="flex max-w-lg flex-col justify-center py-12">
      <div className="rounded-xl border border-border/60 bg-card px-6 py-10 text-center shadow-sm">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileQuestion aria-hidden className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <PendingButtonLink href="/dashboard" pendingText="Loading...">
            Go to dashboard
          </PendingButtonLink>
          <PendingButtonLink href="/" pendingText="Loading..." variant="outline">
            Go to home
          </PendingButtonLink>
        </div>
      </div>
    </PageContainer>
  );
}
