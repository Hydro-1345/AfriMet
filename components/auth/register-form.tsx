"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthMessage } from "@/components/auth/auth-message";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { signUpAction } from "@/lib/auth/actions";
import {
  type RegisterInput,
  PASSWORD_REQUIREMENTS_HINT,
  registerSchema,
} from "@/lib/auth/schemas";

export function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    setFormError(null);
    setSuccessMessage(null);
    const result = await signUpAction(values);

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
        autoComplete="name"
        error={errors.name}
        id="name"
        label="Full name"
        placeholder="Your name"
        registration={register("name")}
        disabled={isSubmitting}
      />

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

      <FormField
        autoComplete="new-password"
        error={errors.password}
        helperText={PASSWORD_REQUIREMENTS_HINT}
        id="password"
        label="Password"
        placeholder="••••••••"
        registration={register("password")}
        type="password"
        disabled={isSubmitting}
      />

      <FormField
        autoComplete="new-password"
        error={errors.confirmPassword}
        id="confirmPassword"
        label="Confirm password"
        placeholder="••••••••"
        registration={register("confirmPassword")}
        type="password"
        disabled={isSubmitting}
      />

      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
