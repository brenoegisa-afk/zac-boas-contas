import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Plus, AlertTriangle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Budget {
  id: string;
  category_id: string;
  amount: number;
  month: number;
  year: number;
  categories: { name: string; color: string };
}

interface BudgetStatus {
  category_id: string;
  category_name: string;
  category_color: string;
  budgeted_amount: number;
  spent_amount: number;
}

interface Category {
  id: string;
  name: string;
}

export function BudgetManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
  });

  useEffect(() => {
    fetchData();
  }, [user, selectedMonth, selectedYear]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get user's family
      const { data: memberData } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)
        .single();

      if (!memberData) return;

      // Fetch budget status
      const { data: statusData, error: statusError } = await supabase
        .rpc('get_budget_status', {
          p_family_id: memberData.family_id,
          p_month: selectedMonth,
          p_year: selectedYear,
        });

      if (statusError) throw statusError;
      setBudgetStatus(statusData || []);

      // Fetch categories
      const { data: catData } = await supabase
        .from('categories')
        .select('id, name')
        .eq('type', 'expense');

      setCategories(catData || []);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os orçamentos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data: memberData } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)
        .single();

      if (!memberData) throw new Error('Família não encontrada');

      const { error } = await supabase.from('budgets').upsert({
        family_id: memberData.family_id,
        category_id: formData.category_id,
        amount: parseFloat(formData.amount),
        month: selectedMonth,
        year: selectedYear,
      });

      if (error) throw error;

      toast({ title: 'Orçamento salvo com sucesso!' });
      setDialogOpen(false);
      setFormData({ category_id: '', amount: '' });
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Orçamentos - {format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy', { locale: ptBR })}</CardTitle>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Definir Orçamento
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgetStatus.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum orçamento definido para este mês.
          </p>
        ) : (
          budgetStatus.map((budget) => {
            const percentage = budget.budgeted_amount > 0 
              ? (budget.spent_amount / budget.budgeted_amount) * 100 
              : 0;
            const isOverBudget = percentage >= 100;

            return (
              <div key={budget.category_id} className="space-y-2 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: budget.category_color }}
                    />
                    <span className="font-medium">{budget.category_name}</span>
                    {isOverBudget && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Excedido
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(budget.spent_amount)} / {formatCurrency(budget.budgeted_amount)}
                  </div>
                </div>
                <Progress value={Math.min(percentage, 100)} className={getProgressColor(percentage)} />
                <div className="text-xs text-muted-foreground text-right">
                  {percentage.toFixed(1)}% utilizado
                </div>
              </div>
            );
          })
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Definir Orçamento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Valor do Orçamento</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
