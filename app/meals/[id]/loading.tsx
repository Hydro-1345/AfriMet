import { PageLoadingSkeleton } from "@/components/ui/page-loading-skeleton";

export default function MealDetailLoading() {
  return (
    <PageLoadingSkeleton cardCount={3} className="max-w-2xl py-6 sm:py-8" />
  );
}
