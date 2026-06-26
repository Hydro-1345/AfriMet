import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface SelectFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  error?: FieldError;
  disabled?: boolean;
  options: readonly { value: string; label: string }[];
  registration: UseFormRegisterReturn;
}

export function SelectField({
  id,
  label,
  placeholder = "Select an option",
  helperText,
  error,
  disabled,
  options,
  registration,
}: SelectFieldProps) {
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
      <select
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          "mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          !registration.name && "text-muted-foreground"
        )}
        disabled={disabled}
        id={id}
        {...registration}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
