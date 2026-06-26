import type { Metadata } from "next";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AddMealForm } from "@/components/meals/add-meal-form";
import { PageContainer } from "@/components/layout/page-container";
import { isProfileComplete } from "@/lib/profile/completion";
import { fetchUserProfile } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Log Meal",
  description: "Record a new meal in your AfriMet history.",
};

export default async function NewMealPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await fetchUserProfile(supabase, user.id);

  if (!isProfileComplete(profile)) {
    redirect("/onboarding");
  }

  return (
    <PageContainer className="max-w-2xl py-6 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus aria-hidden className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Log a meal
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Describe what you ate and optionally add a photo.
              </p>
            </div>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/meals">Back to history</Link>
        </Button>
      </div>

      <AddMealForm />
    </PageContainer>
  );
}
