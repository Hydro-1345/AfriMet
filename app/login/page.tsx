import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SprintNotice } from "@/components/layout/sprint-notice";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your AfriMet account.",
};

export default function LoginPage() {
  return (
    <PageContainer className="flex max-w-md flex-col justify-center py-6 sm:py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Sign in to view your meal history and health summary.
        </p>
      </div>

      <SprintNotice
        className="mt-5"
        description="Account sign-in is not available yet. It will be added in a future release."
        sprint="Coming soon"
        title="Sign-in not yet available"
      />

      <form aria-labelledby="login-heading" className="mt-5 space-y-3.5">
        <h2 className="sr-only" id="login-heading">
          Login form preview
        </h2>
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
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
            disabled
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
          />
        </div>
        <Button className="w-full" disabled type="button">
          Sign in
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/register"
        >
          Create one
        </Link>
      </p>
    </PageContainer>
  );
}
