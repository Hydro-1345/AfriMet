import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { PageContainer } from "@/components/layout/page-container";

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

      <LoginForm />

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
