import { PageLoadingSkeleton } from "@/components/ui/page-loading-skeleton";

export default function OnboardingLoading() {
  return <PageLoadingSkeleton cardCount={2} className="py-6 sm:py-8" />;
}
