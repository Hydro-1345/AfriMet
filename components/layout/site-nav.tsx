import Link from "next/link";
import { getNavLinks } from "@/lib/auth/routes";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/auth/logout-button";

interface SiteNavProps {
  isAuthenticated: boolean;
  className?: string;
  onNavigate?: () => void;
}

export function SiteNav({
  isAuthenticated,
  className,
  onNavigate,
}: SiteNavProps) {
  const links = getNavLinks(isAuthenticated);

  return (
    <nav
      aria-label="Main navigation"
      className={cn("flex items-center gap-1", className)}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={link.href}
          onClick={onNavigate}
        >
          {link.label}
        </Link>
      ))}
      {isAuthenticated ? <LogoutButton /> : null}
    </nav>
  );
}
