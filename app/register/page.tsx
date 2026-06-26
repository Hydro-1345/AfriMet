import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { PageContainer } from "@/components/layout/page-container";

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

      <RegisterForm />

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
