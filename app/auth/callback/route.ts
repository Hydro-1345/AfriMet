import { type NextRequest } from "next/server";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { handleAuthCallback } from "@/lib/auth/handle-auth-callback";

export async function GET(request: NextRequest) {
  const next = getSafeRedirectPath(
    new URL(request.url).searchParams.get("next")
  );

  return handleAuthCallback(request, next);
}
