import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[a-zA-Z]/, "Password must include at least one letter.")
  .regex(/[0-9]/, "Password must include at least one number.");

export const PASSWORD_REQUIREMENTS_HINT =
  "Password must contain at least 8 characters, including one letter and one number.";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required.")
      .max(100, "Name must be 100 characters or fewer."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Enter a valid email address."),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
});

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
