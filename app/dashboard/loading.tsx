import { PageLoadingSkeleton } from "@/components/ui/page-loading-skeleton";

export default function DashboardLoading() {
  return <PageLoadingSkeleton cardCount={5} className="py-6 sm:py-8" />;
}
