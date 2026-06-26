import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { FoodDetailContent } from "@/components/foods/food-detail-content";
import { PageContainer } from "@/components/layout/page-container";
import { fetchFoodBySlug } from "@/lib/foods/queries";
import { foodSlugSchema } from "@/lib/foods/schemas";
import { isProfileComplete } from "@/lib/profile/completion";
import { fetchUserProfile } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";

interface FoodDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: FoodDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = foodSlugSchema.safeParse(slug);

  if (!parsed.success) {
    return { title: "Food Not Found" };
  }

  const supabase = await createClient();
  const food = await fetchFoodBySlug(supabase, parsed.data);

  return {
    title: food?.name ?? "Food Not Found",
    description: food?.description ?? "View food details in the AfriMet food library.",
  };
}

export default async function FoodDetailPage({ params }: FoodDetailPageProps) {
  const { slug } = await params;
  const parsed = foodSlugSchema.safeParse(slug);

  if (!parsed.success) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await fetchUserProfile(supabase, user.id);

  if (!isProfileComplete(profile)) {
    redirect("/onboarding");
  }

  const food = await fetchFoodBySlug(supabase, parsed.data);

  if (!food) {
    notFound();
  }

  return (
    <PageContainer className="max-w-2xl py-6 sm:py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BookOpen aria-hidden className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {food.name}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {food.categoryName}
          </p>
        </div>
      </div>

      <FoodDetailContent food={food} />
    </PageContainer>
  );
}
