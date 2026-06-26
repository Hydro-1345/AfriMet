"use client";

import type { Control, FieldError, UseFormRegisterReturn } from "react-hook-form";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { ACTIVITY_LEVELS } from "@/lib/profile/constants";
import type { ProfileFormInput } from "@/lib/profile/schemas";
import { cn } from "@/lib/utils";

interface ActivityLevelFieldProps {
  id: string;
  label: string;
  error?: FieldError;
  disabled?: boolean;
  registration: UseFormRegisterReturn;
  control: Control<ProfileFormInput>;
}

export function ActivityLevelField({
  id,
  label,
  error,
  disabled,
  registration,
  control,
}: ActivityLevelFieldProps) {
  const selectedValue = useWatch({ control, name: "activityLevel" });
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  const selectedDescription = useMemo(() => {
    if (!selectedValue) {
      return "Choose the option that best matches your typical week.";
    }

    return (
      ACTIVITY_LEVELS.find((level) => level.value === selectedValue)
        ?.description ?? null
    );
  }, [selectedValue]);

  const describedBy =
    [helperId, error ? errorId : null].filter(Boolean).join(" ") || undefined;

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
          !selectedValue && "text-muted-foreground"
        )}
        disabled={disabled}
        id={id}
        {...registration}
      >
        <option value="">Select activity level</option>
        {ACTIVITY_LEVELS.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label} — {level.description}
          </option>
        ))}
      </select>
      {!error ? (
        <p className="mt-1.5 text-sm text-muted-foreground" id={helperId}>
          {selectedDescription}
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
