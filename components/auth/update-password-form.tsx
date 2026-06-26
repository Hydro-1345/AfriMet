"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthMessage } from "@/components/auth/auth-message";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { updatePasswordAction } from "@/lib/auth/actions";
import {
  type UpdatePasswordInput,
  PASSWORD_REQUIREMENTS_HINT,
  updatePasswordSchema,
} from "@/lib/auth/schemas";

export function UpdatePasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: UpdatePasswordInput) {
    setFormError(null);
    const result = await updatePasswordAction(values);

    if (result?.error) {
      setFormError(result.error);
    }
  }

  return (
    <form className="mt-5 space-y-3.5" noValidate onSubmit={handleSubmit(onSubmit)}>
      {formError ? <AuthMessage message={formError} variant="error" /> : null}

      <PasswordField
        autoComplete="new-password"
        error={errors.password}
        helperText={PASSWORD_REQUIREMENTS_HINT}
        id="password"
        label="New password"
        placeholder="••••••••"
        registration={register("password")}
        disabled={isSubmitting}
      />

      <PasswordField
        autoComplete="new-password"
        error={errors.confirmPassword}
        id="confirmPassword"
        label="Confirm new password"
        placeholder="••••••••"
        registration={register("confirmPassword")}
        disabled={isSubmitting}
      />

      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Updating password..." : "Update password"}
      </Button>
    </form>
  );
}
