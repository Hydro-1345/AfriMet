"use client";

import Link from "next/link";
import { PendingLinkLabel } from "@/components/ui/pending-link-label";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PendingButtonLinkProps extends Omit<ButtonProps, "asChild"> {
  href: string;
  children: React.ReactNode;
  pendingText?: React.ReactNode;
}

export function PendingButtonLink({
  href,
  children,
  pendingText,
  className,
  ...buttonProps
}: PendingButtonLinkProps) {
  return (
    <Button asChild className={cn(className)} {...buttonProps}>
      <Link href={href}>
        <PendingLinkLabel pendingText={pendingText}>{children}</PendingLinkLabel>
      </Link>
    </Button>
  );
}
