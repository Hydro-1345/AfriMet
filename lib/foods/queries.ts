import type { SupabaseClient } from "@supabase/supabase-js";
import type { FoodSearchParams } from "@/lib/foods/schemas";
import type {
  Food,
  FoodAliasRow,
  FoodCategory,
  FoodCategoryRow,
  FoodRow,
  FoodSearchResult,
  FoodSearchRow,
} from "@/types/food";

function mapFoodCategoryRow(row: FoodCategoryRow): FoodCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapFoodBase(
  row: FoodRow | FoodSearchRow,
  categorySlug: string,
  categoryName: string,
  aliases: string[]
): Food {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    region: row.region,
    categoryId: row.category_id,
    categorySlug,
    categoryName,
    servingDescription: row.serving_description,
    servingGrams: row.serving_grams,
    isDiaspora: row.is_diaspora,
    aliases,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchAliasesForFoodIds(
  supabase: SupabaseClient,
  foodIds: string[]
): Promise<Map<string, string[]>> {
  if (foodIds.length === 0) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("food_aliases")
    .select("food_id, alias")
    .in("food_id", foodIds)
    .order("alias", { ascending: true });

  if (error || !data) {
    return new Map();
  }

  const aliasMap = new Map<string, string[]>();

  for (const row of data as Pick<FoodAliasRow, "food_id" | "alias">[]) {
    const existing = aliasMap.get(row.food_id) ?? [];
    existing.push(row.alias);
    aliasMap.set(row.food_id, existing);
  }

  return aliasMap;
}

export async function fetchFoodCategories(
  supabase: SupabaseClient
): Promise<FoodCategory[]> {
  const { data, error } = await supabase
    .from("food_categories")
    .select("id, slug, name, description, created_at, updated_at")
    .order("name", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as FoodCategoryRow[]).map(mapFoodCategoryRow);
}

export async function searchFoods(
  supabase: SupabaseClient,
  params: FoodSearchParams
): Promise<FoodSearchResult> {
  const offset = (params.page - 1) * params.pageSize;

  const { data, error } = await supabase.rpc("search_foods", {
    search_query: params.query ?? "",
    category_slug_filter: params.category ?? null,
    region_filter: params.region ?? null,
    result_limit: params.pageSize,
    result_offset: offset,
  });

  if (error || !data) {
    return {
      foods: [],
      totalCount: 0,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: 0,
    };
  }

  const rows = data as FoodSearchRow[];
  const totalCount = rows[0]?.total_count ?? 0;
  const foodIds = rows.map((row) => row.id);
  const aliasMap = await fetchAliasesForFoodIds(supabase, foodIds);

  const foods = rows.map((row) =>
    mapFoodBase(
      row,
      row.category_slug,
      row.category_name,
      aliasMap.get(row.id) ?? []
    )
  );

  return {
    foods,
    totalCount: Number(totalCount),
    page: params.page,
    pageSize: params.pageSize,
    totalPages: totalCount > 0 ? Math.ceil(Number(totalCount) / params.pageSize) : 0,
  };
}

export async function fetchFoodBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Food | null> {
  const { data, error } = await supabase
    .from("foods")
    .select(
      `
      id,
      slug,
      name,
      description,
      region,
      category_id,
      serving_description,
      serving_grams,
      is_diaspora,
      created_at,
      updated_at,
      food_categories (
        slug,
        name
      )
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const row = data as FoodRow & {
    food_categories:
      | { slug: string; name: string }
      | { slug: string; name: string }[]
      | null;
  };

  const aliasMap = await fetchAliasesForFoodIds(supabase, [row.id]);
  const category = Array.isArray(row.food_categories)
    ? row.food_categories[0]
    : row.food_categories;

  if (!category) {
    return null;
  }

  return mapFoodBase(
    row,
    category.slug,
    category.name,
    aliasMap.get(row.id) ?? []
  );
}
