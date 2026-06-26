"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthMessage } from "@/components/auth/auth-message";
import { ProfileFormFields } from "@/components/profile/profile-form-fields";
import { ProfileProgress } from "@/components/profile/profile-progress";
import { Button } from "@/components/ui/button";
import { ONBOARDING_STEPS } from "@/lib/profile/constants";
import { completeOnboardingAction } from "@/lib/profile/actions";
import {
  type ProfileFormInput,
  onboardingStepSchemas,
  profileSchema,
} from "@/lib/profile/schemas";
import type { UserProfile } from "@/types/profile";

interface OnboardingFormProps {
  defaultName: string;
  existingProfile?: UserProfile | null;
}

function getDefaultValues(
  defaultName: string,
  existingProfile?: UserProfile | null
): ProfileFormInput {
  return {
    name: existingProfile?.name ?? defaultName,
    age: existingProfile?.age ?? Number.NaN,
    sex: existingProfile?.sex ?? "",
    heightCm: existingProfile?.heightCm ?? Number.NaN,
    weightKg: existingProfile?.weightKg ?? Number.NaN,
    country: existingProfile?.country ?? "",
    activityLevel: existingProfile?.activityLevel ?? "",
    diabetesStatus: existingProfile?.diabetesStatus ?? "",
    hypertensionStatus: existingProfile?.hypertensionStatus ?? "",
    goalType: existingProfile?.goalType ?? "",
  } as ProfileFormInput;
}

export function OnboardingForm({
  defaultName,
  existingProfile,
}: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: getDefaultValues(defaultName, existingProfile),
    mode: "onBlur",
    shouldUnregister: false,
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = form;

  const stepIndex = (currentStep - 1) as 0 | 1 | 2 | 3;
  const stepMeta = ONBOARDING_STEPS[stepIndex];

  async function validateCurrentStep(): Promise<boolean> {
    const stepSchema = onboardingStepSchemas[stepIndex];
    const values = getValues();
    const stepFields = Object.keys(stepSchema.shape) as (keyof ProfileFormInput)[];
    const isValid = await trigger(stepFields);

    if (!isValid) {
      return false;
    }

    const parsed = stepSchema.safeParse(values);

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please check this step.");
      return false;
    }

    setFormError(null);
    return true;
  }

  async function handleNext() {
    setIsStepLoading(true);

    try {
      const isValid = await validateCurrentStep();

      if (isValid && currentStep < ONBOARDING_STEPS.length) {
        setCurrentStep((step) => step + 1);
      }
    } finally {
      setIsStepLoading(false);
    }
  }

  function handleBack() {
    setFormError(null);
    setCurrentStep((step) => Math.max(1, step - 1));
  }

  async function onSubmit() {
    setFormError(null);
    const values = getValues();
    const parsed = profileSchema.safeParse(values);

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid profile data.");
      return;
    }

    const result = await completeOnboardingAction(parsed.data);

    if (result?.error) {
      setFormError(result.error);
    }
  }

  return (
    <form
      className="mt-8 space-y-8"
      noValidate
      onSubmit={(event) => event.preventDefault()}
    >
      <ProfileProgress currentStep={currentStep} />

      <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">{stepMeta.title}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {stepMeta.description}
        </p>

        <div className="mt-6">
          <ProfileFormFields
            control={control}
            disabled={isSubmitting || isStepLoading}
            errors={errors}
            register={register}
            step={currentStep}
          />
        </div>
      </div>

      {formError ? <AuthMessage message={formError} variant="error" /> : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          disabled={currentStep === 1 || isSubmitting || isStepLoading}
          onClick={handleBack}
          type="button"
          variant="outline"
        >
          Back
        </Button>

        {currentStep < ONBOARDING_STEPS.length ? (
          <Button disabled={isSubmitting || isStepLoading} onClick={handleNext} type="button">
            {isStepLoading ? "Checking..." : "Continue"}
          </Button>
        ) : (
          <Button
            aria-busy={isSubmitting}
            disabled={isSubmitting}
            onClick={() => void handleSubmit(onSubmit)()}
            type="button"
          >
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                Saving profile...
              </>
            ) : (
              "Save profile"
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
