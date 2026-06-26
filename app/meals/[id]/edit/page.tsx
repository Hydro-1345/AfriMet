import type { Metadata } from "next";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EditMealForm } from "@/components/meals/edit-meal-form";
import { PageContainer } from "@/components/layout/page-container";
import { fetchMealById } from "@/lib/meals/queries";
import { isProfileComplete } from "@/lib/profile/completion";
import { fetchUserProfile } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

interface EditMealPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditMealPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Edit Meal",
    description: `Edit meal ${id} in your AfriMet history.`,
  };
}

export default async function EditMealPage({ params }: EditMealPageProps) {
  const { id } = await params;
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

  const meal = await fetchMealById(supabase, user.id, id);

  if (!meal) {
    notFound();
  }

  return (
    <PageContainer className="max-w-2xl py-6 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Pencil aria-hidden className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Edit meal
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Update your meal description, date, or photo.
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href={`/meals/${meal.id}`}>Back to details</Link>
        </Button>
      </div>

      <EditMealForm meal={meal} />
    </PageContainer>
  );
}
