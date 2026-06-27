const BLOCKED_REDIRECT_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/auth/callback",
] as const;

/**
 * Returns a same-origin path safe for post-auth redirects.
 * Prevents open redirects and auth loops.
 */
export function getSafeRedirectPath(
  path: string | null | undefined,
  fallback = "/dashboard"
): string {
  if (!path) {
    return fallback;
  }

  const trimmed = path.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  if (BLOCKED_REDIRECT_PREFIXES.some((prefix) => trimmed.startsWith(prefix))) {
    return fallback;
  }

  return trimmed;
}
