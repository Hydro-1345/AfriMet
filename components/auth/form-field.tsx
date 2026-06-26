import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  id: string;
  label: string;
  type?: HTMLInputElement["type"];
  autoComplete?: string;
  placeholder?: string;
  helperText?: string;
  error?: FieldError;
  disabled?: boolean;
  registration: UseFormRegisterReturn;
}

export function FormField({
  id,
  label,
  type = "text",
  autoComplete,
  placeholder,
  helperText,
  error,
  disabled,
  registration,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const describedBy =
    [helperText ? helperId : null, error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div>
      <label className="block text-sm font-medium text-foreground" htmlFor={id}>
        {label}
      </label>
      <Input
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        autoComplete={autoComplete}
        className="mt-1"
        disabled={disabled}
        id={id}
        placeholder={placeholder}
        type={type}
        {...registration}
      />
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
