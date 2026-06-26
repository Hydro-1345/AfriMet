import Link from "next/link";
import { cn } from "@/lib/utils";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

interface SiteNavProps {
  className?: string;
  onNavigate?: () => void;
}

export function SiteNav({ className, onNavigate }: SiteNavProps) {
  return (
    <nav aria-label="Main navigation" className={cn("flex items-center gap-1", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={link.href}
          onClick={onNavigate}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
