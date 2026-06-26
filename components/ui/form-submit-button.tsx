"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormSubmitButtonProps extends ButtonProps {
  children: React.ReactNode;
  pendingText: React.ReactNode;
}

export function FormSubmitButton({
  children,
  pendingText,
  className,
  disabled,
  ...buttonProps
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-busy={pending}
      className={cn(className)}
      disabled={disabled || pending}
      type="submit"
      {...buttonProps}
    >
      {pending ? (
        <>
          <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
