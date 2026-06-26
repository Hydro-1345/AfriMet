"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { AuthMessage } from "@/components/auth/auth-message";
import { deleteMealAction } from "@/lib/meals/actions";
import { Button } from "@/components/ui/button";

interface DeleteMealButtonProps {
  mealId: string;
  redirectTo?: string;
}

export function DeleteMealButton({
  mealId,
  redirectTo = "/meals",
}: DeleteMealButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Delete this meal? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await deleteMealAction(mealId);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <Button
        disabled={isPending}
        onClick={handleDelete}
        type="button"
        variant="destructive"
      >
        <Trash2 aria-hidden className="h-4 w-4" />
        {isPending ? "Deleting..." : "Delete meal"}
      </Button>
      {error ? <AuthMessage message={error} variant="error" /> : null}
    </div>
  );
}
