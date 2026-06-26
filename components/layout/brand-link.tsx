"use client";

import Link from "next/link";
import { PendingLinkLabel } from "@/components/ui/pending-link-label";
import { cn } from "@/lib/utils";

interface BrandLinkProps {
  className?: string;
}

export function BrandLink({ className }: BrandLinkProps) {
  return (
    <Link
      className={cn(
        "flex items-center gap-2 font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      href="/"
    >
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
      >
        A
      </span>
      <PendingLinkLabel pendingText="Opening home...">
        <span>AfriMet</span>
      </PendingLinkLabel>
    </Link>
  );
}
