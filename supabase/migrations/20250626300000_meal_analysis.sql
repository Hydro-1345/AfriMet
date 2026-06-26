-- Sprint 6: AI meal analysis
-- Run in Supabase SQL Editor or via Supabase CLI

CREATE TYPE public.analysis_status_type AS ENUM ('completed', 'failed');

CREATE TABLE public.meal_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL UNIQUE REFERENCES public.meals (id) ON DELETE CASCADE,
  status public.analysis_status_type NOT NULL,
  analysis_notes TEXT,
  overall_confidence NUMERIC(4, 3),
  error_message TEXT,
  model TEXT,
  analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT meal_analyses_confidence_range CHECK (
    overall_confidence IS NULL
    OR (overall_confidence >= 0 AND overall_confidence <= 1)
  )
);

CREATE TABLE public.meal_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES public.meals (id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  estimated_weight NUMERIC(8, 2),
  confidence_score NUMERIC(4, 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT meal_components_food_name_length CHECK (
    char_length(food_name) >= 1 AND char_length(food_name) <= 120
  ),
  CONSTRAINT meal_components_weight_positive CHECK (
    estimated_weight IS NULL OR estimated_weight > 0
  ),
  CONSTRAINT meal_components_confidence_range CHECK (
    confidence_score IS NULL
    OR (confidence_score >= 0 AND confidence_score <= 1)
  )
);

CREATE TABLE public.nutrition_records (
  meal_id UUID PRIMARY KEY REFERENCES public.meals (id) ON DELETE CASCADE,
  calories NUMERIC(8, 2) NOT NULL,
  protein NUMERIC(8, 2) NOT NULL,
  carbs NUMERIC(8, 2) NOT NULL,
  fat NUMERIC(8, 2) NOT NULL,
  fiber NUMERIC(8, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT nutrition_records_non_negative CHECK (
    calories >= 0
    AND protein >= 0
    AND carbs >= 0
    AND fat >= 0
    AND fiber >= 0
  )
);

CREATE INDEX meal_analyses_meal_id_idx ON public.meal_analyses (meal_id);
CREATE INDEX meal_components_meal_id_idx ON public.meal_components (meal_id);

CREATE TRIGGER meal_analyses_set_updated_at
BEFORE UPDATE ON public.meal_analyses
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER nutrition_records_set_updated_at
BEFORE UPDATE ON public.nutrition_records
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security
ALTER TABLE public.meal_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meal analyses"
ON public.meal_analyses
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = meal_analyses.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own meal analyses"
ON public.meal_analyses
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = meal_analyses.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own meal analyses"
ON public.meal_analyses
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = meal_analyses.meal_id
      AND meals.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = meal_analyses.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own meal analyses"
ON public.meal_analyses
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = meal_analyses.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own meal components"
ON public.meal_components
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = meal_components.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own meal components"
ON public.meal_components
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = meal_components.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own meal components"
ON public.meal_components
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = meal_components.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own nutrition records"
ON public.nutrition_records
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = nutrition_records.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own nutrition records"
ON public.nutrition_records
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = nutrition_records.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own nutrition records"
ON public.nutrition_records
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = nutrition_records.meal_id
      AND meals.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = nutrition_records.meal_id
      AND meals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own nutrition records"
ON public.nutrition_records
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.meals
    WHERE meals.id = nutrition_records.meal_id
      AND meals.user_id = auth.uid()
  )
);
