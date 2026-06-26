import { PageLoadingSkeleton } from "@/components/ui/page-loading-skeleton";

export default function MealAnalysisLoading() {
  return (
    <PageLoadingSkeleton cardCount={4} className="max-w-2xl py-6 sm:py-8" />
  );
}
