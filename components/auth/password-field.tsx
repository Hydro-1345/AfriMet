"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
  id: string;
  label: string;
  autoComplete?: string;
  placeholder?: string;
  helperText?: string;
  error?: FieldError;
  disabled?: boolean;
  registration: UseFormRegisterReturn;
}

export function PasswordField({
  id,
  label,
  autoComplete,
  placeholder,
  helperText,
  error,
  disabled,
  registration,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const toggleId = useId();
  const describedBy =
    [helperText ? helperId : null, error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div>
      <label className="block text-sm font-medium text-foreground" htmlFor={id}>
        {label}
      </label>
      <div className="relative mt-1">
        <Input
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          autoComplete={autoComplete}
          className="pr-10"
          disabled={disabled}
          id={id}
          placeholder={placeholder}
          type={visible ? "text" : "password"}
          {...registration}
        />
        <button
          aria-controls={id}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className={cn(
            "absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          )}
          disabled={disabled}
          id={toggleId}
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? (
            <EyeOff aria-hidden className="h-4 w-4" />
          ) : (
            <Eye aria-hidden className="h-4 w-4" />
          )}
        </button>
      </div>
      {helperText && !error ? (
        <p className="mt-1.5 text-sm text-muted-foreground" id={helperId}>
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p className="mt-1.5 text-sm text-destructive" id={errorId} role="alert">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
