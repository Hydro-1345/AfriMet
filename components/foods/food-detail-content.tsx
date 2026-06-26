import { ArrowLeft } from "lucide-react";
import { PendingButtonLink } from "@/components/ui/pending-button-link";
import { formatServing, getFoodRegionLabel } from "@/lib/foods/format";
import type { Food } from "@/types/food";

interface FoodDetailContentProps {
  food: Food;
}

export function FoodDetailContent({ food }: FoodDetailContentProps) {
  const serving = formatServing(food.servingDescription, food.servingGrams);

  return (
    <div className="mt-6 space-y-6">
      <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {food.categoryName}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {getFoodRegionLabel(food.region)}
          </span>
          {food.isDiaspora ? (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Diaspora
            </span>
          ) : null}
        </div>

        {food.description ? (
          <p className="mt-4 text-sm leading-relaxed text-foreground sm:text-base">
            {food.description}
          </p>
        ) : null}
      </section>

      {serving ? (
        <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Serving information</h2>
          <p className="mt-2 text-sm text-muted-foreground">{serving}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Nutrition values will be linked in a future release.
          </p>
        </section>
      ) : null}

      {food.aliases.length > 0 ? (
        <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Also known as</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {food.aliases.map((alias) => (
              <li key={alias}>
                <span className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-sm text-foreground">
                  {alias}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div>
        <PendingButtonLink href="/foods" pendingText="Loading..." variant="outline">
          <ArrowLeft aria-hidden className="h-4 w-4" />
          Back to food library
        </PendingButtonLink>
      </div>
    </div>
  );
}
