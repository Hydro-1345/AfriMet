import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Update Password",
  description: "Set a new password for your AfriMet account.",
};

export default function UpdatePasswordPage() {
  return (
    <PageContainer className="flex max-w-md flex-col justify-center py-6 sm:py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Choose a new password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Enter a new password for your AfriMet account.
        </p>
      </div>

      <UpdatePasswordForm />
    </PageContainer>
  );
}
