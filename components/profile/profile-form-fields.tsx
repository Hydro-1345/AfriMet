import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { FormField } from "@/components/auth/form-field";
import { ActivityLevelField } from "@/components/profile/activity-level-field";
import { SelectField } from "@/components/profile/select-field";
import {
  COUNTRIES,
  GOAL_OPTIONS,
  HEALTH_STATUS_OPTIONS,
  SEX_OPTIONS,
} from "@/lib/profile/constants";
import { type ProfileFormInput, numberFieldOptions } from "@/lib/profile/schemas";

interface ProfileFormFieldsProps {
  step: number;
  register: UseFormRegister<ProfileFormInput>;
  control: Control<ProfileFormInput>;
  errors: FieldErrors<ProfileFormInput>;
  disabled?: boolean;
  nameReadOnly?: boolean;
}

export function ProfileFormFields({
  step,
  register,
  control,
  errors,
  disabled,
  nameReadOnly,
}: ProfileFormFieldsProps) {
  if (step === 1) {
    return (
      <div className="space-y-4">
        <FormField
          disabled={disabled || nameReadOnly}
          error={errors.name}
          id="name"
          label="Full name"
          placeholder="Your name"
          registration={register("name")}
          readOnly={nameReadOnly}
        />
        <FormField
          disabled={disabled}
          error={errors.age}
          id="age"
          inputMode="numeric"
          label="Age"
          placeholder="e.g. 32"
          registration={register("age", numberFieldOptions)}
          type="number"
        />
        <SelectField
          disabled={disabled}
          error={errors.sex}
          id="sex"
          label="Sex"
          options={SEX_OPTIONS}
          placeholder="Select sex"
          registration={register("sex")}
        />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <FormField
          disabled={disabled}
          error={errors.heightCm}
          helperText="Enter your height in centimetres."
          id="heightCm"
          inputMode="decimal"
          label="Height (cm)"
          placeholder="e.g. 175"
          registration={register("heightCm", numberFieldOptions)}
          type="number"
        />
        <FormField
          disabled={disabled}
          error={errors.weightKg}
          helperText="Enter your weight in kilograms."
          id="weightKg"
          inputMode="decimal"
          label="Weight (kg)"
          placeholder="e.g. 72"
          registration={register("weightKg", numberFieldOptions)}
          type="number"
        />
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-4">
        <SelectField
          disabled={disabled}
          error={errors.country}
          id="country"
          label="Country"
          options={COUNTRIES}
          placeholder="Select country"
          registration={register("country")}
        />
        <ActivityLevelField
          control={control}
          disabled={disabled}
          error={errors.activityLevel}
          id="activityLevel"
          label="Activity level"
          registration={register("activityLevel")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground">
        All fields in this section are optional. You can skip them now and update
        your profile later.
      </p>
      <SelectField
        disabled={disabled}
        error={errors.diabetesStatus}
        id="diabetesStatus"
        label="Diabetes status (optional)"
        options={HEALTH_STATUS_OPTIONS}
        placeholder="Select an option"
        registration={register("diabetesStatus")}
      />
      <SelectField
        disabled={disabled}
        error={errors.hypertensionStatus}
        id="hypertensionStatus"
        label="Hypertension status (optional)"
        options={HEALTH_STATUS_OPTIONS}
        placeholder="Select an option"
        registration={register("hypertensionStatus")}
      />
      <SelectField
        disabled={disabled}
        error={errors.goalType}
        id="goalType"
        label="Weight goal (optional)"
        options={GOAL_OPTIONS}
        placeholder="Select a goal"
        registration={register("goalType")}
      />
    </div>
  );
}
