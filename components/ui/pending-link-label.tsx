"use client";

import { Loader2 } from "lucide-react";
import { useLinkStatus } from "next/link";
import { cn } from "@/lib/utils";

interface PendingLinkLabelProps {
  children: React.ReactNode;
  pendingText?: React.ReactNode;
  className?: string;
  showSpinner?: boolean;
}

export function PendingLinkLabel({
  children,
  pendingText,
  className,
  showSpinner = true,
}: PendingLinkLabelProps) {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-busy={pending}
      className={cn(
        "inline-flex items-center gap-1.5 transition-opacity",
        pending && "opacity-70",
        className
      )}
    >
      {pending && showSpinner ? (
        <Loader2 aria-hidden className="h-3.5 w-3.5 shrink-0 animate-spin" />
      ) : null}
      {pending && pendingText !== undefined ? pendingText : children}
    </span>
  );
}
