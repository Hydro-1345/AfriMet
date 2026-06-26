import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { redirect } from "next/navigation";
import { FoodList } from "@/components/foods/food-list";
import { FoodPagination } from "@/components/foods/food-pagination";
import { FoodSearchFilters } from "@/components/foods/food-search-filters";
import { PageContainer } from "@/components/layout/page-container";
import { fetchFoodCategories, searchFoods } from "@/lib/foods/queries";
import { foodSearchSchema } from "@/lib/foods/schemas";
import { isProfileComplete } from "@/lib/profile/completion";
import { fetchUserProfile } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Food Library",
  description: "Browse and search African and diaspora foods in AfriMet.",
};

interface FoodsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getSearchParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function FoodsPage({ searchParams }: FoodsPageProps) {
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

  const rawParams = await searchParams;
  const parsed = foodSearchSchema.safeParse({
    query: getSearchParam(rawParams, "q") ?? "",
    category: getSearchParam(rawParams, "category") ?? "",
    region: getSearchParam(rawParams, "region") ?? "",
    page: getSearchParam(rawParams, "page") ?? "1",
  });

  const searchParamsParsed = parsed.success
    ? parsed.data
    : foodSearchSchema.parse({});

  const [categories, searchResult] = await Promise.all([
    fetchFoodCategories(supabase),
    searchFoods(supabase, searchParamsParsed),
  ]);

  const hasActiveFilters = Boolean(
    searchParamsParsed.query ||
      searchParamsParsed.category ||
      searchParamsParsed.region
  );

  return (
    <PageContainer className="py-6 sm:py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BookOpen aria-hidden className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Food library
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {searchResult.totalCount === 0
              ? "Search African and diaspora foods."
              : `${searchResult.totalCount} food${searchResult.totalCount === 1 ? "" : "s"} found.`}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <FoodSearchFilters
          categories={categories}
          initialParams={searchParamsParsed}
        />

        <FoodList foods={searchResult.foods} hasActiveFilters={hasActiveFilters} />

        <FoodPagination
          searchParams={searchParamsParsed}
          totalPages={searchResult.totalPages}
        />
      </div>
    </PageContainer>
  );
}
