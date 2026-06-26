-- Sprint 3: User profiles and health profiles
-- Run in Supabase SQL Editor or via Supabase CLI

-- Enums for profile fields
CREATE TYPE public.sex_type AS ENUM ('male', 'female', 'other');

CREATE TYPE public.activity_level_type AS ENUM (
  'sedentary',
  'lightly_active',
  'moderately_active',
  'very_active',
  'extremely_active'
);

CREATE TYPE public.health_status_type AS ENUM ('yes', 'no', 'prefer_not_to_say');

CREATE TYPE public.goal_type AS ENUM (
  'weight_loss',
  'weight_gain',
  'maintenance'
);

-- Core user profile (maps to Technical Specification Users table)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  sex public.sex_type,
  country TEXT,
  height_cm NUMERIC(5, 2),
  weight_kg NUMERIC(5, 2),
  activity_level public.activity_level_type,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT profiles_age_range CHECK (age IS NULL OR (age >= 18 AND age <= 120)),
  CONSTRAINT profiles_height_range CHECK (
    height_cm IS NULL OR (height_cm >= 100 AND height_cm <= 250)
  ),
  CONSTRAINT profiles_weight_range CHECK (
    weight_kg IS NULL OR (weight_kg >= 30 AND weight_kg <= 300)
  )
);

-- Optional health profile (maps to Technical Specification Health Profiles table)
CREATE TABLE public.health_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  diabetes_status public.health_status_type,
  hypertension_status public.health_status_type,
  goal_type public.goal_type,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX profiles_country_idx ON public.profiles (country);

-- Keep updated_at current
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER health_profiles_set_updated_at
BEFORE UPDATE ON public.health_profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own health profile"
ON public.health_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health profile"
ON public.health_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health profile"
ON public.health_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
