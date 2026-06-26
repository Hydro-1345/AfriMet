export const PROTECTED_ROUTES = ["/dashboard"] as const;

export const AUTH_ROUTES = ["/login", "/register", "/forgot-password"] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
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
    ];
  }

  return [
    { href: "/", label: "Home" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ];
}
