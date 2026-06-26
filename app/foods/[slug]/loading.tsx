import { PageContainer } from "@/components/layout/page-container";

export default function FoodDetailLoading() {
  return (
    <PageContainer className="max-w-2xl py-6 sm:py-8">
      <div className="animate-pulse space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-lg bg-muted" />
          <div className="h-4 w-32 rounded-lg bg-muted" />
        </div>
        <div className="h-36 rounded-xl bg-muted" />
        <div className="h-28 rounded-xl bg-muted" />
      </div>
    </PageContainer>
  );
}
