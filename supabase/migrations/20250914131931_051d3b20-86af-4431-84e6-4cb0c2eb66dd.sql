-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create families table for family groups
CREATE TABLE public.families (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for families
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

-- Create family_members table for family memberships
CREATE TABLE public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(family_id, user_id)
);

-- Enable RLS for family_members
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Create categories table for transaction categories
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'DollarSign',
  is_default BOOLEAN DEFAULT false,
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create transactions table for income and expenses
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  notes TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for families
CREATE POLICY "Family creators can view their families" 
ON public.families 
FOR SELECT 
USING (auth.uid() = created_by);

CREATE POLICY "Family members can view their families" 
ON public.families 
FOR SELECT 
USING (id IN (
  SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create families" 
ON public.families 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Family admins can update families" 
ON public.families 
FOR UPDATE 
USING (id IN (
  SELECT family_id FROM public.family_members 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create policies for family_members
CREATE POLICY "Family members can view family memberships" 
ON public.family_members 
FOR SELECT 
USING (family_id IN (
  SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
));

CREATE POLICY "Family admins can manage memberships" 
ON public.family_members 
FOR ALL 
USING (family_id IN (
  SELECT family_id FROM public.family_members 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create policies for categories
CREATE POLICY "Family members can view categories" 
ON public.categories 
FOR SELECT 
USING (
  is_default = true OR 
  family_id IN (
    SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Family admins can manage categories" 
ON public.categories 
FOR ALL 
USING (family_id IN (
  SELECT family_id FROM public.family_members 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create policies for transactions
CREATE POLICY "Family members can view family transactions" 
ON public.transactions 
FOR SELECT 
USING (family_id IN (
  SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
));

CREATE POLICY "Family members can create transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  family_id IN (
    SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own transactions" 
ON public.transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON public.transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO public.categories (name, type, color, icon, is_default) VALUES
('Salário', 'income', '#10B981', 'Banknote', true),
('Freelance', 'income', '#059669', 'Laptop', true),
('Investimentos', 'income', '#0D9488', 'TrendingUp', true),
('Outros Rendimentos', 'income', '#0891B2', 'PlusCircle', true),
('Alimentação', 'expense', '#EF4444', 'UtensilsCrossed', true),
('Transporte', 'expense', '#F97316', 'Car', true),
('Moradia', 'expense', '#8B5CF6', 'Home', true),
('Saúde', 'expense', '#EC4899', 'Heart', true),
('Educação', 'expense', '#3B82F6', 'GraduationCap', true),
('Lazer', 'expense', '#06B6D4', 'Gamepad2', true),
('Compras', 'expense', '#84CC16', 'ShoppingBag', true),
('Contas Fixas', 'expense', '#6366F1', 'Receipt', true),
('Outros Gastos', 'expense', '#64748B', 'MoreHorizontal', true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_families_updated_at
  BEFORE UPDATE ON public.families
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();