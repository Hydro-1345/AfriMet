import type { AuthError } from "@supabase/supabase-js";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Email or password is incorrect. Please try again.",
  email_not_confirmed:
    "Please confirm your email address before signing in. Check your inbox for a confirmation link.",
  user_already_exists:
    "An account with this email already exists. Try signing in instead.",
  weak_password:
    "Password is too weak. Use at least 8 characters with a mix of letters and numbers.",
  same_password: "New password must be different from your current password.",
  session_expired: "Your session has expired. Please sign in again.",
  over_request_rate_limit:
    "Too many attempts. Please wait a few minutes and try again.",
  user_not_found: "No account found with this email address.",
};

export function mapAuthError(error: AuthError | Error | null): string {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if ("code" in error && error.code && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code];
  }

  const message = error.message.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return AUTH_ERROR_MESSAGES.invalid_credentials;
  }

  if (message.includes("email not confirmed")) {
    return AUTH_ERROR_MESSAGES.email_not_confirmed;
  }

  if (message.includes("user already registered")) {
    return AUTH_ERROR_MESSAGES.user_already_exists;
  }

  if (message.includes("password")) {
    return AUTH_ERROR_MESSAGES.weak_password;
  }

  if (message.includes("invalid api key")) {
    return "Authentication configuration error. Please contact support.";
  }

  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("failed to fetch")
  ) {
    return "Network error. Check your connection and try again.";
  }

  if (message.includes("jwt") || message.includes("session")) {
    return AUTH_ERROR_MESSAGES.session_expired;
  }

  return "Something went wrong. Please try again.";
}
