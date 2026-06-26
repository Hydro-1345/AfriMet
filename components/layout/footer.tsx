import Link from "next/link";
import { navLinks } from "@/components/layout/site-nav";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-foreground">AfriMet</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Metabolic health for African and diaspora communities. Understand
              your meals. Support your health.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Navigation
            </h2>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Mission
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              AfriMet is building better nutrition tools for African foods,
              including meal analysis and metabolic insights.
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-border/60 pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} AfriMet. Health Tech LAB.</p>
        </div>
      </div>
    </footer>
  );
}
