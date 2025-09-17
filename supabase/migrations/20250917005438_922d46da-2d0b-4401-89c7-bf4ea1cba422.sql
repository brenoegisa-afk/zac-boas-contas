-- Fix RLS infinite recursion by creating security definer functions
-- First, create a function to check if user is family member
CREATE OR REPLACE FUNCTION public.is_family_member(family_uuid uuid, user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM family_members 
    WHERE family_id = family_uuid 
    AND user_id = user_uuid
  );
$$;

-- Function to check if user is family admin
CREATE OR REPLACE FUNCTION public.is_family_admin(family_uuid uuid, user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM family_members 
    WHERE family_id = family_uuid 
    AND user_id = user_uuid 
    AND role = 'admin'
  );
$$;

-- Function to get user's families
CREATE OR REPLACE FUNCTION public.get_user_families(user_uuid uuid DEFAULT auth.uid())
RETURNS TABLE(family_id uuid)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT fm.family_id FROM family_members fm WHERE fm.user_id = user_uuid;
$$;

-- Drop existing problematic policies on family_members
DROP POLICY IF EXISTS "Family admins can manage memberships" ON family_members;
DROP POLICY IF EXISTS "Family members can view family memberships" ON family_members;

-- Create new non-recursive policies for family_members
CREATE POLICY "Users can view their own memberships"
ON family_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Family admins can manage all memberships"
ON family_members
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM family_members fm2 
    WHERE fm2.family_id = family_members.family_id 
    AND fm2.user_id = auth.uid() 
    AND fm2.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM family_members fm2 
    WHERE fm2.family_id = family_members.family_id 
    AND fm2.user_id = auth.uid() 
    AND fm2.role = 'admin'
  )
);

-- Create telegram_integrations table for secure Telegram user mapping
CREATE TABLE public.telegram_integrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  telegram_user_id bigint NOT NULL UNIQUE,
  telegram_username text,
  telegram_first_name text,
  telegram_last_name text,
  verified_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on telegram_integrations
ALTER TABLE public.telegram_integrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for telegram_integrations
CREATE POLICY "Users can view their own telegram integration"
ON telegram_integrations
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own telegram integration"
ON telegram_integrations
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own telegram integration"
ON telegram_integrations
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own telegram integration"
ON telegram_integrations
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Add trigger for telegram_integrations timestamps
CREATE TRIGGER update_telegram_integrations_updated_at
BEFORE UPDATE ON public.telegram_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Remove telegram_username from profiles table as it's now in telegram_integrations
ALTER TABLE public.profiles DROP COLUMN IF EXISTS telegram_username;