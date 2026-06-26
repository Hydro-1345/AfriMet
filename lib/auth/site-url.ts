import { headers } from "next/headers";

export async function getSiteUrl(): Promise<string> {
  const headersList = await headers();
  const origin = headersList.get("origin");

  if (origin) {
    return origin;
  }

  const host = headersList.get("host");

  if (host) {
    const protocol = host.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
