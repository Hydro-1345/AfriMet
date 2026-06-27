import { type NextRequest } from "next/server";
import { handleAuthCallback } from "@/lib/auth/handle-auth-callback";

export async function GET(request: NextRequest) {
  return handleAuthCallback(request, "/auth/update-password");
}
