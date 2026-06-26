export const PROTECTED_ROUTES = [
  "/dashboard",
  "/onboarding",
  "/profile",
  "/meals",
  "/foods",
] as const;

export const ONBOARDING_ROUTE = "/onboarding";

export const AUTH_ROUTES = ["/login", "/register", "/forgot-password"] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function isAuthCallbackRoute(pathname: string): boolean {
  return pathname.startsWith("/auth/");
}

export type NavLink = {
  href: string;
  label: string;
};

export function getNavLinks(isAuthenticated: boolean): NavLink[] {
  if (isAuthenticated) {
    return [
      { href: "/", label: "Home" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/meals", label: "Meals" },
      { href: "/foods", label: "Foods" },
      { href: "/profile", label: "Profile" },
    ];
  }

  return [
    { href: "/", label: "Home" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ];
}
