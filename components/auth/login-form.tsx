"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthMessage } from "@/components/auth/auth-message";
import { PasswordField } from "@/components/auth/password-field";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { type LoginInput, loginSchema } from "@/lib/auth/schemas";
import { signInAction } from "@/lib/auth/actions";

export function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    const result = await signInAction(values);

    if (result?.error) {
      setFormError(result.error);
    }
  }

  return (
    <form className="mt-5 space-y-3.5" noValidate onSubmit={handleSubmit(onSubmit)}>
      {formError ? <AuthMessage message={formError} variant="error" /> : null}

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

      <PasswordField
        autoComplete="current-password"
        error={errors.password}
        id="password"
        label="Password"
        placeholder="••••••••"
        registration={register("password")}
        disabled={isSubmitting}
      />

      <div className="flex justify-end">
        <Link
          className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
      </div>

      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
