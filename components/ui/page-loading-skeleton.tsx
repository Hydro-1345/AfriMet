import { PageContainer } from "@/components/layout/page-container";
import { cn } from "@/lib/utils";

interface PageLoadingSkeletonProps {
  className?: string;
  maxWidth?: "default" | "narrow";
  cardCount?: number;
}

export function PageLoadingSkeleton({
  className,
  maxWidth = "default",
  cardCount = 3,
}: PageLoadingSkeletonProps) {
  return (
    <PageContainer
      className={cn(
        maxWidth === "narrow" && "max-w-2xl",
        className
      )}
    >
      <div aria-busy="true" aria-live="polite" className="animate-pulse space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-7 w-40 rounded-md bg-muted" />
            <div className="h-4 w-56 rounded-md bg-muted" />
          </div>
        </div>

        <div className="h-32 rounded-xl bg-muted" />

        {Array.from({ length: cardCount }).map((_, index) => (
          <div className="h-24 rounded-xl bg-muted" key={index} />
        ))}

        <p className="sr-only">Loading page content...</p>
      </div>
    </PageContainer>
  );
}
