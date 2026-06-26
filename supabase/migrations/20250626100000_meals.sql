-- Sprint 4: Meal logging
-- Run in Supabase SQL Editor or via Supabase CLI

CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  image_url TEXT,
  meal_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT meals_description_length CHECK (
    char_length(description) >= 1 AND char_length(description) <= 2000
  )
);

CREATE INDEX meals_user_id_idx ON public.meals (user_id);
CREATE INDEX meals_user_meal_date_idx ON public.meals (user_id, meal_date DESC);

CREATE TRIGGER meals_set_updated_at
BEFORE UPDATE ON public.meals
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meals"
ON public.meals
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
ON public.meals
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
ON public.meals
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
ON public.meals
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Meal image storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'meal-images',
  'meal-images',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own meal images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'meal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own meal images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'meal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own meal images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'meal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'meal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own meal images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'meal-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
