"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { FOOD_REGIONS } from "@/lib/foods/constants";
import type { FoodSearchParams } from "@/lib/foods/schemas";
import { Input } from "@/components/ui/input";
import type { FoodCategory } from "@/types/food";

interface FoodSearchFiltersProps {
  categories: FoodCategory[];
  initialParams: FoodSearchParams;
}

function buildFoodsHref(params: {
  query: string;
  category?: string;
  region?: string;
}): string {
  const search = new URLSearchParams();

  if (params.query.trim()) {
    search.set("q", params.query.trim());
  }

  if (params.category) {
    search.set("category", params.category);
  }

  if (params.region) {
    search.set("region", params.region);
  }

  const queryString = search.toString();
  return queryString ? `/foods?${queryString}` : "/foods";
}

export function FoodSearchFilters({
  categories,
  initialParams,
}: FoodSearchFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialParams.query ?? "");
  const [category, setCategory] = useState(initialParams.category ?? "");
  const [region, setRegion] = useState(initialParams.region ?? "");

  useEffect(() => {
    setQuery(initialParams.query ?? "");
    setCategory(initialParams.category ?? "");
    setRegion(initialParams.region ?? "");
  }, [initialParams.category, initialParams.query, initialParams.region]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextHref = buildFoodsHref({ query, category, region });
      const currentHref = buildFoodsHref({
        query: initialParams.query ?? "",
        category: initialParams.category,
        region: initialParams.region,
      });

      if (nextHref !== currentHref) {
        startTransition(() => {
          router.push(nextHref);
        });
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [category, initialParams.category, initialParams.query, initialParams.region, query, region, router]);

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div>
        <label className="block text-sm font-medium text-foreground" htmlFor="food-search">
          Search foods
        </label>
        <div className="relative mt-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-busy={isPending}
            autoComplete="off"
            className="pl-9"
            id="food-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or alias, e.g. jollof, dodo, ugali"
            type="search"
            value={query}
          />
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Partial, case-insensitive search across food names and aliases.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground" htmlFor="food-category">
            Category
          </label>
          <select
            className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            id="food-category"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground" htmlFor="food-region">
            Region
          </label>
          <select
            className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            id="food-region"
            onChange={(event) => setRegion(event.target.value)}
            value={region}
          >
            <option value="">All regions</option>
            {FOOD_REGIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isPending ? (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          Updating results...
        </p>
      ) : null}
    </div>
  );
}
