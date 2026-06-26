"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthMessage } from "@/components/auth/auth-message";
import { ACCEPTED_IMAGE_EXTENSIONS } from "@/lib/meals/constants";
import {
  getDefaultMealDateValue,
  toDateTimeLocalValue,
} from "@/lib/meals/format";
import { type MealFormInput, mealSchema } from "@/lib/meals/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Meal } from "@/types/meal";

interface MealFormProps {
  mode: "create" | "edit";
  meal?: Meal;
  submitLabel: string;
  pendingLabel: string;
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean; message?: string }>;
}

function toFormValues(meal?: Meal): MealFormInput {
  return {
    description: meal?.description ?? "",
    mealDate: meal ? toDateTimeLocalValue(meal.mealDate) : getDefaultMealDateValue(),
    removeImage: false,
  };
}

export function MealForm({
  mode,
  meal,
  submitLabel,
  pendingLabel,
  onSubmit,
}: MealFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    meal?.imageSignedUrl ?? null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<MealFormInput>({
    resolver: zodResolver(mealSchema),
    defaultValues: toFormValues(meal),
    mode: "onBlur",
    shouldUnregister: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = form;

  const removeImage = watch("removeImage");

  useEffect(() => {
    return () => {
      if (selectedFile && imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, selectedFile]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setFormError(null);
    setValue("removeImage", false, { shouldDirty: true });

    if (!file) {
      setImagePreview(meal?.imageSignedUrl ?? null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  function handleRemoveImage() {
    setSelectedFile(null);
    setImagePreview(null);
    setValue("removeImage", true, { shouldDirty: true });
  }

  async function submitForm() {
    setFormError(null);
    setSuccessMessage(null);

    const parsed = mealSchema.safeParse(getValues());

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid meal data.");
      return;
    }

    const formData = new FormData();
    formData.set("description", parsed.data.description);
    formData.set("mealDate", parsed.data.mealDate);

    if (parsed.data.removeImage) {
      formData.set("removeImage", "true");
    }

    if (selectedFile) {
      formData.set("image", selectedFile);
    }

    const result = await onSubmit(formData);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    if (mode === "edit") {
      setSuccessMessage(result.message ?? "Meal updated successfully.");
    }
  }

  const acceptValue = ACCEPTED_IMAGE_EXTENSIONS.join(",");

  return (
    <form className="mt-6 space-y-6" noValidate onSubmit={handleSubmit(submitForm)}>
      <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">Meal details</h2>

        <div className="mt-5 space-y-5">
          <div>
            <label
              className="block text-sm font-medium text-foreground"
              htmlFor="description"
            >
              Description
            </label>
            <Textarea
              aria-describedby={errors.description ? "description-error" : "description-helper"}
              aria-invalid={errors.description ? true : undefined}
              className="mt-1"
              disabled={isSubmitting}
              id="description"
              placeholder='e.g. "2 wraps of amala with ewedu and goat meat"'
              {...register("description")}
            />
            <p className="mt-1.5 text-sm text-muted-foreground" id="description-helper">
              Describe what you ate. Nutrition analysis will be added in a later release.
            </p>
            {errors.description ? (
              <p className="mt-1.5 text-sm text-destructive" id="description-error" role="alert">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-foreground"
              htmlFor="mealDate"
            >
              Date and time
            </label>
            <Input
              aria-describedby={errors.mealDate ? "mealDate-error" : undefined}
              aria-invalid={errors.mealDate ? true : undefined}
              className="mt-1"
              disabled={isSubmitting}
              id="mealDate"
              type="datetime-local"
              {...register("mealDate")}
            />
            {errors.mealDate ? (
              <p className="mt-1.5 text-sm text-destructive" id="mealDate-error" role="alert">
                {errors.mealDate.message}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Meal photo <span className="text-sm font-normal text-muted-foreground">(optional)</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a JPG, PNG, or HEIC image up to 5 MB.
        </p>

        <div className="mt-5 space-y-4">
          {imagePreview && !removeImage ? (
            <div className="overflow-hidden rounded-lg border border-border/60 bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Meal preview"
                className="h-48 w-full object-cover sm:h-56"
                src={imagePreview}
              />
            </div>
          ) : null}

          <div>
            <Input
              accept={acceptValue}
              disabled={isSubmitting}
              id="image"
              onChange={handleImageChange}
              type="file"
            />
          </div>

          {(imagePreview && !removeImage) || meal?.imageSignedUrl ? (
            <Button
              disabled={isSubmitting}
              onClick={handleRemoveImage}
              type="button"
              variant="outline"
            >
              Remove image
            </Button>
          ) : null}
        </div>
      </section>

      {formError ? <AuthMessage message={formError} variant="error" /> : null}
      {successMessage ? (
        <AuthMessage message={successMessage} variant="success" />
      ) : null}

      <div className="flex justify-end">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
              {pendingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
