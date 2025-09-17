-- Inserir categorias padrão para receitas e despesas
INSERT INTO public.categories (name, type, color, icon, is_default) VALUES
  -- Categorias de Receita
  ('Salário', 'income', '#10B981', 'Banknote', true),
  ('Freelance', 'income', '#059669', 'Laptop', true),
  ('Investimentos', 'income', '#047857', 'TrendingUp', true),
  ('Vendas', 'income', '#065F46', 'ShoppingCart', true),
  ('Bonificação', 'income', '#064E3B', 'Gift', true),
  ('Renda Extra', 'income', '#22C55E', 'Plus', true),
  
  -- Categorias de Despesa
  ('Alimentação', 'expense', '#EF4444', 'UtensilsCrossed', true),
  ('Transporte', 'expense', '#DC2626', 'Car', true),
  ('Moradia', 'expense', '#B91C1C', 'Home', true),
  ('Saúde', 'expense', '#991B1B', 'Heart', true),
  ('Educação', 'expense', '#7F1D1D', 'GraduationCap', true),
  ('Lazer', 'expense', '#F97316', 'Gamepad2', true),
  ('Compras', 'expense', '#EA580C', 'ShoppingBag', true),
  ('Contas', 'expense', '#C2410C', 'Receipt', true),
  ('Outros', 'expense', '#9A3412', 'MoreHorizontal', true)
ON CONFLICT (name, type) DO NOTHING;