"use client";

import { signOutAction } from "@/lib/auth/actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <FormSubmitButton
        className="justify-start px-3 font-medium text-muted-foreground hover:text-accent-foreground md:w-auto"
        pendingText="Signing out..."
        size="sm"
        variant="ghost"
      >
        Logout
      </FormSubmitButton>
    </form>
  );
}
