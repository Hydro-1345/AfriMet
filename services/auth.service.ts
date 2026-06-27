"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mapAuthError } from "@/lib/auth/errors";
import {
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterInput,
  type UpdatePasswordInput,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from "@/lib/auth/schemas";
import { getSiteUrl } from "@/lib/auth/site-url";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { createClient } from "@/lib/supabase/server";

export type AuthActionResult = {
  error?: string;
  success?: boolean;
  message?: string;
};

export async function signInAction(
  input: LoginInput & { redirect?: string }
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: mapAuthError(error) };
  }

  revalidatePath("/", "layout");
  redirect(getSafeRedirectPath(input.redirect));
}

export async function signUpAction(
  input: RegisterInput
): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  const siteUrl = await getSiteUrl();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
      },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: mapAuthError(error) };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  if (data.user) {
    return {
      success: true,
      message:
        "If registration is possible for this email, check your inbox for a confirmation link before signing in.",
    };
  }

  return {
    error: "Unable to complete registration. Please try again.",
  };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function forgotPasswordAction(
  input: ForgotPasswordInput
): Promise<AuthActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  const siteUrl = await getSiteUrl();
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${siteUrl}/auth/callback?next=/auth/update-password`,
    }
  );

  if (error) {
    return { error: mapAuthError(error) };
  }

  return {
    success: true,
    message:
      "If an account exists for that email, you will receive a password reset link shortly.",
  };
}

export async function updatePasswordAction(
  input: UpdatePasswordInput
): Promise<AuthActionResult> {
  const parsed = updatePasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Your reset link has expired. Request a new password reset email.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: mapAuthError(error) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
