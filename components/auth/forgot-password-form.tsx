"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthMessage } from "@/components/auth/auth-message";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction } from "@/lib/auth/actions";
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/lib/auth/schemas";

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setFormError(null);
    setSuccessMessage(null);
    const result = await forgotPasswordAction(values);

    if (result?.error) {
      setFormError(result.error);
      return;
    }

    if (result?.success && result.message) {
      setSuccessMessage(result.message);
    }
  }

  return (
    <form className="mt-5 space-y-3.5" noValidate onSubmit={handleSubmit(onSubmit)}>
      {formError ? <AuthMessage message={formError} variant="error" /> : null}
      {successMessage ? (
        <AuthMessage message={successMessage} variant="success" />
      ) : null}

      <FormField
        autoComplete="email"
        error={errors.email}
        id="email"
        label="Email address"
        placeholder="you@example.com"
        registration={register("email")}
        type="email"
        disabled={isSubmitting}
      />

      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Sending link..." : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/login"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
