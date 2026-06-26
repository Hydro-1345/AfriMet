-- Sprint 7: Metabolic scoring and health insights
-- Run in Supabase SQL Editor or via Supabase CLI

CREATE TYPE public.glycemic_impact_level AS ENUM ('low', 'moderate', 'high');

CREATE TYPE public.satiety_estimate_level AS ENUM ('low', 'moderate', 'high');

CREATE TYPE public.health_insight_type AS ENUM (
  'positive',
  'improvement',
  'observation'
);

CREATE TYPE public.health_insight_category AS ENUM (
  'protein',
  'fiber',
  'carbs',
  'calories',
  'fat',
  'context',
  'general'
);

CREATE TABLE public.metabolic_scores (
  meal_id UUID PRIMARY KEY REFERENCES public.meals (id) ON DELETE CASCADE,
  score NUMERIC(5, 2),
  score_category TEXT,
  glycemic_impact public.glycemic_impact_level NOT NULL,
  satiety_estimate public.satiety_estimate_level NOT NULL,
  health_explanation TEXT NOT NULL,
  portion_size_grams NUMERIC(8, 2),
  calculation_version TEXT NOT NULL,
  source_nutrition_updated_at TIMESTAMPTZ NOT NULL,
  source_profile_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT metabolic_scores_score_range CHECK (
    score IS NULL OR (score >= 0 AND score <= 100)
  ),
  CONSTRAINT metabolic_scores_score_category_values CHECK (
    score_category IS NULL
    OR score_category IN ('excellent', 'good', 'moderate', 'needs_improvement')
  )
);

CREATE TABLE public.health_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES public.meals (id) ON DELETE CASCADE,
  insight_type public.health_insight_type NOT NULL,
  category public.health_insight_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT health_insights_title_length CHECK (
    char_length(title) >= 1 AND char_length(title) <= 120
  ),
  CONSTRAINT health_insights_description_length CHECK (
    char_length(description) >= 1 AND char_length(description) <= 1000
  )
);

CREATE INDEX health_insights_meal_id_idx ON public.health_insights (meal_id);
CREATE INDEX health_insights_meal_sort_idx ON public.health_insights (meal_id, sort_order);

CREATE TRIGGER metabolic_scores_set_updated_at
BEFORE UPDATE ON public.metabolic_scores
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.metabolic_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own metabolic scores"
ON public.metabolic_scores
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = metabolic_scores.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own metabolic scores"
ON public.metabolic_scores
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = metabolic_scores.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own metabolic scores"
ON public.metabolic_scores
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = metabolic_scores.meal_id
      AND meals.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = metabolic_scores.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own metabolic scores"
ON public.metabolic_scores
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = metabolic_scores.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own health insights"
ON public.health_insights
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = health_insights.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own health insights"
ON public.health_insights
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = health_insights.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own health insights"
ON public.health_insights
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = health_insights.meal_id
      AND meals.user_id = auth.uid()
  )
);
