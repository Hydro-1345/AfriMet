-- Sprint 5: African food database
-- Run in Supabase SQL Editor or via Supabase CLI

CREATE TYPE public.food_region_type AS ENUM (
  'west_africa',
  'east_africa',
  'southern_africa',
  'north_africa',
  'diaspora'
);

CREATE TABLE public.food_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT food_categories_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE public.foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.food_categories (id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  region public.food_region_type NOT NULL,
  serving_description TEXT,
  serving_grams NUMERIC(8, 2),
  is_diaspora BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT foods_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 120),
  CONSTRAINT foods_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT foods_serving_grams_positive CHECK (
    serving_grams IS NULL OR serving_grams > 0
  )
);

CREATE TABLE public.food_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id UUID NOT NULL REFERENCES public.foods (id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  alias_normalized TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT food_aliases_alias_length CHECK (
    char_length(alias) >= 1 AND char_length(alias) <= 120
  ),
  CONSTRAINT food_aliases_unique_normalized UNIQUE (food_id, alias_normalized)
);

CREATE INDEX food_categories_slug_idx ON public.food_categories (slug);
CREATE INDEX foods_category_id_idx ON public.foods (category_id);
CREATE INDEX foods_region_idx ON public.foods (region);
CREATE INDEX foods_slug_idx ON public.foods (slug);
CREATE INDEX foods_name_lower_idx ON public.foods (lower(name));
CREATE INDEX food_aliases_food_id_idx ON public.food_aliases (food_id);
CREATE INDEX food_aliases_alias_normalized_idx ON public.food_aliases (alias_normalized);
CREATE INDEX food_aliases_alias_lower_idx ON public.food_aliases (lower(alias));

CREATE TRIGGER food_categories_set_updated_at
BEFORE UPDATE ON public.food_categories
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER foods_set_updated_at
BEFORE UPDATE ON public.foods
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security: reference data readable by authenticated users
ALTER TABLE public.food_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view food categories"
ON public.food_categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view foods"
ON public.foods
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view food aliases"
ON public.food_aliases
FOR SELECT
TO authenticated
USING (true);

-- Search function with pagination support
CREATE OR REPLACE FUNCTION public.search_foods(
  search_query TEXT DEFAULT '',
  category_slug_filter TEXT DEFAULT NULL,
  region_filter public.food_region_type DEFAULT NULL,
  result_limit INT DEFAULT 20,
  result_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name TEXT,
  description TEXT,
  region public.food_region_type,
  category_id UUID,
  category_slug TEXT,
  category_name TEXT,
  serving_description TEXT,
  serving_grams NUMERIC,
  is_diaspora BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  total_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  WITH filtered AS (
    SELECT DISTINCT
      f.id,
      f.slug,
      f.name,
      f.description,
      f.region,
      f.category_id,
      fc.slug AS category_slug,
      fc.name AS category_name,
      f.serving_description,
      f.serving_grams,
      f.is_diaspora,
      f.created_at,
      f.updated_at
    FROM public.foods f
    INNER JOIN public.food_categories fc ON fc.id = f.category_id
    LEFT JOIN public.food_aliases fa ON fa.food_id = f.id
    WHERE
      (
        search_query IS NULL
        OR btrim(search_query) = ''
        OR f.name ILIKE '%' || btrim(search_query) || '%'
        OR f.description ILIKE '%' || btrim(search_query) || '%'
        OR fa.alias ILIKE '%' || btrim(search_query) || '%'
      )
      AND (
        category_slug_filter IS NULL
        OR btrim(category_slug_filter) = ''
        OR fc.slug = category_slug_filter
      )
      AND (
        region_filter IS NULL
        OR f.region = region_filter
      )
  )
  SELECT
    filtered.id,
    filtered.slug,
    filtered.name,
    filtered.description,
    filtered.region,
    filtered.category_id,
    filtered.category_slug,
    filtered.category_name,
    filtered.serving_description,
    filtered.serving_grams,
    filtered.is_diaspora,
    filtered.created_at,
    filtered.updated_at,
    COUNT(*) OVER() AS total_count
  FROM filtered
  ORDER BY filtered.name ASC
  LIMIT GREATEST(result_limit, 0)
  OFFSET GREATEST(result_offset, 0);
$$;
