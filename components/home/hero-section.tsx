import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export function HeroSection({ isAuthenticated }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-accent/30 px-6 py-10 sm:px-8 sm:py-12 lg:py-14"
    >
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium text-primary">
          Metabolic health for African and diaspora communities
        </p>

        <h1
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          id="hero-heading"
        >
          Understand the metabolic impact of{" "}
          <span className="text-primary">your meals</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          AfriMet helps you see how the foods you eat affect your health. It is
          built around African meals, from jollof rice to amala and ewedu.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {isAuthenticated ? (
            <>
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Go to dashboard
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/profile">View profile</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/register">
                  Get started
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
