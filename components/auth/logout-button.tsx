"use client";

import { signOutAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <Button
        className="justify-start px-3 font-medium text-muted-foreground hover:text-accent-foreground md:w-auto"
        size="sm"
        type="submit"
        variant="ghost"
      >
        Logout
      </Button>
    </form>
  );
}
