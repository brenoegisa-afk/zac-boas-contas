-- Fix infinite recursion in family_members RLS policies by creating security definer functions

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Family admins can manage all memberships" ON public.family_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.family_members;

-- Create security definer function to check if user is family admin
CREATE OR REPLACE FUNCTION public.is_user_family_admin(target_family_id uuid, user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.family_members fm
    WHERE fm.family_id = target_family_id 
    AND fm.user_id = user_uuid 
    AND fm.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create security definer function to get user families
CREATE OR REPLACE FUNCTION public.get_user_family_ids(user_uuid uuid DEFAULT auth.uid())
RETURNS uuid[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT fm.family_id 
    FROM public.family_members fm 
    WHERE fm.user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create new policies using security definer functions
CREATE POLICY "Users can view their own memberships" 
ON public.family_members 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own memberships" 
ON public.family_members 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Family admins can manage memberships" 
ON public.family_members 
FOR ALL 
USING (public.is_user_family_admin(family_id, auth.uid()))
WITH CHECK (public.is_user_family_admin(family_id, auth.uid()));

-- Update categories policies to use new function
DROP POLICY IF EXISTS "Family members can view categories" ON public.categories;
DROP POLICY IF EXISTS "Family admins can manage categories" ON public.categories;

CREATE POLICY "Family members can view categories" 
ON public.categories 
FOR SELECT 
USING (
  is_default = true 
  OR family_id = ANY(public.get_user_family_ids(auth.uid()))
);

CREATE POLICY "Family admins can manage categories" 
ON public.categories 
FOR ALL 
USING (public.is_user_family_admin(family_id, auth.uid()))
WITH CHECK (public.is_user_family_admin(family_id, auth.uid()));

-- Update families policies
DROP POLICY IF EXISTS "Family members can view their families" ON public.families;

CREATE POLICY "Family members can view their families" 
ON public.families 
FOR SELECT 
USING (
  created_by = auth.uid() 
  OR id = ANY(public.get_user_family_ids(auth.uid()))
);

-- Update transactions policies
DROP POLICY IF EXISTS "Family members can view family transactions" ON public.transactions;
DROP POLICY IF EXISTS "Family members can create transactions" ON public.transactions;

CREATE POLICY "Family members can view family transactions" 
ON public.transactions 
FOR SELECT 
USING (family_id = ANY(public.get_user_family_ids(auth.uid())));

CREATE POLICY "Family members can create transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND family_id = ANY(public.get_user_family_ids(auth.uid()))
);