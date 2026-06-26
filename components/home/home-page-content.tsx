import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BenefitsSection } from "@/components/home/benefits-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { ProblemSection } from "@/components/home/problem-section";
import { Button } from "@/components/ui/button";

interface HomePageContentProps {
  isAuthenticated: boolean;
}

export function HomePageContent({ isAuthenticated }: HomePageContentProps) {
  return (
    <>
      <HeroSection isAuthenticated={isAuthenticated} />
      <ProblemSection />
      <FeaturesSection />
      <BenefitsSection />

      <section aria-labelledby="cta-heading" className="mt-12 text-center">
        <h2
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          id="cta-heading"
        >
          Start with AfriMet
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Create an account to follow your meals and understand their metabolic
          impact.
        </p>
        <Button asChild className="mt-6" size="lg">
          <Link href="/register">
            Create your account
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </>
  );
}
