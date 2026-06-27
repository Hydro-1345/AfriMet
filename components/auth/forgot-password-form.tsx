"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthMessage } from "@/components/auth/auth-message";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { mapAuthError } from "@/lib/auth/errors";
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/lib/auth/schemas";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  async function onSubmit(values: ForgotPasswordInput) {
    setFormError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback/recovery`;

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo,
      });

      if (error) {
        setFormError(mapAuthError(error));
        return;
      }

      setSuccessMessage(
        "If an account exists for that email, you will receive a password reset link shortly."
      );
    } finally {
      setIsSubmitting(false);
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

      <Button aria-busy={isSubmitting} className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          <>
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            Sending link...
          </>
        ) : (
          "Send reset link"
        )}
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
