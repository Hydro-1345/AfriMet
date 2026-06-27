import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { PageContainer } from "@/components/layout/page-container";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your AfriMet account.",
};

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getSearchParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const rawParams = await searchParams;
  const redirectTo = getSafeRedirectPath(getSearchParam(rawParams, "redirect"));

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

      <LoginForm redirectTo={redirectTo} />

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
