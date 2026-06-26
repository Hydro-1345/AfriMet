"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PendingLinkLabel } from "@/components/ui/pending-link-label";
import { LogoutButton } from "@/components/auth/logout-button";
import { getNavLinks } from "@/lib/auth/routes";
import { cn } from "@/lib/utils";

interface SiteNavProps {
  isAuthenticated: boolean;
  className?: string;
  onNavigate?: () => void;
}

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav({
  isAuthenticated,
  className,
  onNavigate,
}: SiteNavProps) {
  const pathname = usePathname();
  const links = getNavLinks(isAuthenticated);

  return (
    <nav
      aria-label="Main navigation"
      className={cn("flex items-center gap-1", className)}
    >
      {links.map((link) => {
        const active = isNavLinkActive(pathname, link.href);

        return (
          <Link
            key={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            href={link.href}
            onClick={onNavigate}
          >
            <PendingLinkLabel pendingText={`Opening ${link.label.toLowerCase()}...`}>
              {link.label}
            </PendingLinkLabel>
          </Link>
        );
      })}
      {isAuthenticated ? <LogoutButton /> : null}
    </nav>
  );
}
