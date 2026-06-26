import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SprintNotice } from "@/components/layout/sprint-notice";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your AfriMet account.",
};

export default function RegisterPage() {
  return (
    <PageContainer className="flex max-w-md flex-col justify-center py-6 sm:py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Set up an account to track meals and follow your metabolic health.
        </p>
      </div>

      <SprintNotice
        className="mt-5"
        description="Registration is not available yet. It will be added in a future release."
        sprint="Coming soon"
        title="Registration not yet available"
      />

      <form aria-labelledby="register-heading" className="mt-5 space-y-3.5">
        <h2 className="sr-only" id="register-heading">
          Registration form preview
        </h2>
        <div>
          <label
            className="block text-sm font-medium text-foreground"
            htmlFor="name"
          >
            Full name
          </label>
          <input
            autoComplete="name"
            className="mt-1 w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
            disabled
            id="name"
            name="name"
            placeholder="Your name"
            type="text"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-foreground"
            htmlFor="email"
          >
            Email address
          </label>
          <input
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
            disabled
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-foreground"
            htmlFor="password"
          >
            Password
          </label>
          <input
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
            disabled
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
          />
        </div>
        <Button className="w-full" disabled type="button">
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/login"
        >
          Sign in
        </Link>
      </p>
    </PageContainer>
  );
}
