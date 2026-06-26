"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthMessage } from "@/components/auth/auth-message";
import { ProfileFormFields } from "@/components/profile/profile-form-fields";
import { Button } from "@/components/ui/button";
import { saveProfileAction } from "@/lib/profile/actions";
import { type ProfileFormInput, profileSchema } from "@/lib/profile/schemas";
import type { UserProfile } from "@/types/profile";

interface EditProfileFormProps {
  profile: UserProfile;
}

function toFormValues(profile: UserProfile): ProfileFormInput {
  return {
    name: profile.name,
    age: profile.age ?? Number.NaN,
    sex: profile.sex ?? "male",
    heightCm: profile.heightCm ?? Number.NaN,
    weightKg: profile.weightKg ?? Number.NaN,
    country: profile.country ?? "",
    activityLevel: profile.activityLevel ?? "sedentary",
    diabetesStatus: profile.diabetesStatus ?? "",
    hypertensionStatus: profile.hypertensionStatus ?? "",
    goalType: profile.goalType ?? "",
  } as ProfileFormInput;
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: toFormValues(profile),
    mode: "onBlur",
    shouldUnregister: false,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = form;

  async function onSubmit() {
    setFormError(null);
    setSuccessMessage(null);

    const parsed = profileSchema.safeParse(getValues());

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid profile data.");
      return;
    }

    const result = await saveProfileAction(parsed.data);

    if (result?.error) {
      setFormError(result.error);
      return;
    }

    if (result?.profile) {
      reset(toFormValues(result.profile));
    }

    setSuccessMessage(result?.message ?? "Profile updated successfully.");
  }

  return (
    <form className="mt-6 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-8">
        <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">About you</h2>
          <div className="mt-5">
            <ProfileFormFields
              control={control}
              disabled={isSubmitting}
              errors={errors}
              register={register}
              step={1}
            />
          </div>
        </section>

        <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Body metrics</h2>
          <div className="mt-5">
            <ProfileFormFields
              control={control}
              disabled={isSubmitting}
              errors={errors}
              register={register}
              step={2}
            />
          </div>
        </section>

        <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Lifestyle</h2>
          <div className="mt-5">
            <ProfileFormFields
              control={control}
              disabled={isSubmitting}
              errors={errors}
              register={register}
              step={3}
            />
          </div>
        </section>

        <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Health goals <span className="text-sm font-normal text-muted-foreground">(optional)</span>
          </h2>
          <div className="mt-5">
            <ProfileFormFields
              control={control}
              disabled={isSubmitting}
              errors={errors}
              register={register}
              step={4}
            />
          </div>
        </section>
      </div>

      {formError ? <AuthMessage message={formError} variant="error" /> : null}
      {successMessage ? (
        <AuthMessage message={successMessage} variant="success" />
      ) : null}

      <div className="flex justify-end">
        <Button disabled={isSubmitting || !isDirty} type="submit">
          {isSubmitting ? "Saving changes..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
