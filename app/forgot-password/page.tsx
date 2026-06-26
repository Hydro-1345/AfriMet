import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your AfriMet account password.",
};

export default function ForgotPasswordPage() {
  return (
    <PageContainer className="flex max-w-md flex-col justify-center py-6 sm:py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Enter your email and we will send you a link to choose a new password.
        </p>
      </div>

      <ForgotPasswordForm />
    </PageContainer>
  );
}
