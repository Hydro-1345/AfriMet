import { PageContainer } from "@/components/layout/page-container";

export default function FoodsLoading() {
  return (
    <PageContainer className="py-6 sm:py-8">
      <div className="animate-pulse space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-muted" />
          <div className="h-4 w-72 rounded-lg bg-muted" />
        </div>
        <div className="h-44 rounded-xl bg-muted" />
        <div className="space-y-3">
          <div className="h-24 rounded-xl bg-muted" />
          <div className="h-24 rounded-xl bg-muted" />
          <div className="h-24 rounded-xl bg-muted" />
        </div>
      </div>
    </PageContainer>
  );
}
