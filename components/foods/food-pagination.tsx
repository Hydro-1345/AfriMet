"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PendingLinkLabel } from "@/components/ui/pending-link-label";
import { Button } from "@/components/ui/button";
import type { FoodSearchParams } from "@/lib/foods/schemas";
import { cn } from "@/lib/utils";

interface FoodPaginationProps {
  searchParams: FoodSearchParams;
  totalPages: number;
  className?: string;
}

function buildFoodsHref(params: FoodSearchParams, page: number): string {
  const query = new URLSearchParams();

  if (params.query) {
    query.set("q", params.query);
  }

  if (params.category) {
    query.set("category", params.category);
  }

  if (params.region) {
    query.set("region", params.region);
  }

  if (page > 1) {
    query.set("page", String(page));
  }

  const queryString = query.toString();
  return queryString ? `/foods?${queryString}` : "/foods";
}

export function FoodPagination({
  searchParams,
  totalPages,
  className,
}: FoodPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const currentPage = searchParams.page;
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav
      aria-label="Food library pagination"
      className={cn("flex items-center justify-between gap-4", className)}
    >
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        {previousPage ? (
          <Button asChild size="sm" variant="outline">
            <Link href={buildFoodsHref(searchParams, previousPage)}>
              <PendingLinkLabel pendingText="Loading...">
                <>
                  <ChevronLeft aria-hidden className="h-4 w-4" />
                  Previous
                </>
              </PendingLinkLabel>
            </Link>
          </Button>
        ) : (
          <Button disabled size="sm" variant="outline">
            <ChevronLeft aria-hidden className="h-4 w-4" />
            Previous
          </Button>
        )}
        {nextPage ? (
          <Button asChild size="sm" variant="outline">
            <Link href={buildFoodsHref(searchParams, nextPage)}>
              <PendingLinkLabel pendingText="Loading...">
                <>
                  Next
                  <ChevronRight aria-hidden className="h-4 w-4" />
                </>
              </PendingLinkLabel>
            </Link>
          </Button>
        ) : (
          <Button disabled size="sm" variant="outline">
            Next
            <ChevronRight aria-hidden className="h-4 w-4" />
          </Button>
        )}
      </div>
    </nav>
  );
}
