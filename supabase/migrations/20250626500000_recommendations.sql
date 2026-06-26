-- Sprint 8: Personalized recommendations
-- Run in Supabase SQL Editor or via Supabase CLI

CREATE TYPE public.recommendation_type AS ENUM (
  'improve_metabolic_health',
  'improve_satiety',
  'reduce_cost',
  'weight_loss',
  'weight_gain',
  'diabetes_friendly',
  'healthier_alternative',
  'portion_guidance',
  'fibre_improvement',
  'protein_improvement',
  'vegetable_suggestion',
  'hypertension_aware',
  'activity_guidance'
);

CREATE TYPE public.recommendation_priority AS ENUM ('high', 'medium', 'low');

CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES public.meals (id) ON DELETE CASCADE,
  recommendation_type public.recommendation_type NOT NULL,
  recommendation_text TEXT NOT NULL,
  explanation TEXT NOT NULL,
  priority public.recommendation_priority NOT NULL DEFAULT 'medium',
  sort_order INTEGER NOT NULL DEFAULT 0,
  calculation_version TEXT NOT NULL,
  source_nutrition_updated_at TIMESTAMPTZ NOT NULL,
  source_metabolic_updated_at TIMESTAMPTZ,
  source_profile_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT recommendations_text_length CHECK (
    char_length(recommendation_text) >= 1 AND char_length(recommendation_text) <= 500
  ),
  CONSTRAINT recommendations_explanation_length CHECK (
    char_length(explanation) >= 1 AND char_length(explanation) <= 1000
  )
);

CREATE INDEX recommendations_meal_id_idx ON public.recommendations (meal_id);
CREATE INDEX recommendations_meal_sort_idx ON public.recommendations (meal_id, sort_order);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations"
ON public.recommendations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = recommendations.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own recommendations"
ON public.recommendations
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = recommendations.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own recommendations"
ON public.recommendations
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = recommendations.meal_id
      AND meals.user_id = auth.uid()
  )
);
