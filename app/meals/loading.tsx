import { PageLoadingSkeleton } from "@/components/ui/page-loading-skeleton";

export default function MealsLoading() {
  return <PageLoadingSkeleton cardCount={4} className="py-6 sm:py-8" />;
}
