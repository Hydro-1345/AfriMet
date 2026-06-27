import { headers } from "next/headers";

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, "");
}

/**
 * Resolves the public site URL for auth email links and callbacks.
 * Prefers NEXT_PUBLIC_SITE_URL in production (set in Vercel + Supabase).
 */
export async function getSiteUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }

  const headersList = await headers();
  const origin = headersList.get("origin");

  if (origin) {
    return normalizeSiteUrl(origin);
  }

  const host = headersList.get("host");

  if (host) {
    const protocol = host.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
