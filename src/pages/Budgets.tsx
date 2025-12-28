import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Wallet, Plus, Edit2, Trash2, AlertTriangle, CheckCircle, 
  TrendingUp, TrendingDown, Target, Calendar
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: string;
}

interface Budget {
  id: string;
  category_id: string;
  amount: number;
  month: number;
  year: number;
  family_id: string;
}

interface BudgetStatus {
  category_id: string;
  category_name: string;
  category_color: string;
  category_icon: string;
  budgeted_amount: number;
  spent_amount: number;
}

const Budgets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetStatus | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

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
        .limit(1)
        .single();

      if (!memberData) {
        setLoading(false);
        return;
      }

      setFamilyId(memberData.family_id);

      // Get budget status using the database function
      const { data: statusData, error: statusError } = await supabase
        .rpc('get_budget_status', {
          p_family_id: memberData.family_id,
          p_month: selectedMonth,
          p_year: selectedYear
        });

      if (statusError) throw statusError;
      setBudgetStatus(statusData || []);

      // Get expense categories for creating new budgets
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'expense');

      setCategories(categoriesData || []);

    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar orçamentos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveBudget = async () => {
    if (!familyId || !selectedCategory || !budgetAmount) return;

    try {
      const amount = parseFloat(budgetAmount);
      
      // Check if budget exists
      const { data: existingBudget } = await supabase
        .from('budgets')
        .select('id')
        .eq('family_id', familyId)
        .eq('category_id', selectedCategory)
        .eq('month', selectedMonth)
        .eq('year', selectedYear)
        .single();

      if (existingBudget) {
        // Update existing budget
        await supabase
          .from('budgets')
          .update({ amount })
          .eq('id', existingBudget.id);
      } else {
        // Create new budget
        await supabase
          .from('budgets')
          .insert({
            family_id: familyId,
            category_id: selectedCategory,
            amount,
            month: selectedMonth,
            year: selectedYear
          });
      }

      toast({
        title: 'Sucesso',
        description: 'Orçamento salvo com sucesso!',
      });

      setIsDialogOpen(false);
      setSelectedCategory('');
      setBudgetAmount('');
      setEditingBudget(null);
      fetchData();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar orçamento',
        variant: 'destructive',
      });
    }
  };

  const deleteBudget = async (categoryId: string) => {
    if (!familyId) return;

    try {
      await supabase
        .from('budgets')
        .delete()
        .eq('family_id', familyId)
        .eq('category_id', categoryId)
        .eq('month', selectedMonth)
        .eq('year', selectedYear);

      toast({
        title: 'Sucesso',
        description: 'Orçamento removido!',
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover orçamento',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (budget: BudgetStatus) => {
    setEditingBudget(budget);
    setSelectedCategory(budget.category_id);
    setBudgetAmount(budget.budgeted_amount.toString());
    setIsDialogOpen(true);
  };

  const getStatusColor = (spent: number, budgeted: number) => {
    if (budgeted === 0) return 'bg-muted';
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const getStatusBadge = (spent: number, budgeted: number) => {
    if (budgeted === 0) return { text: 'Sem orçamento', variant: 'secondary' as const, icon: Target };
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return { text: 'Excedido', variant: 'destructive' as const, icon: AlertTriangle };
    if (percentage >= 80) return { text: 'Atenção', variant: 'warning' as const, icon: TrendingUp };
    return { text: 'No limite', variant: 'success' as const, icon: CheckCircle };
  };

  const totalBudgeted = budgetStatus.reduce((acc, b) => acc + Number(b.budgeted_amount), 0);
  const totalSpent = budgetStatus.reduce((acc, b) => acc + Number(b.spent_amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!familyId) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Wallet className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Crie uma família primeiro</h2>
        <p className="text-muted-foreground text-center">
          Para gerenciar orçamentos, você precisa criar ou fazer parte de uma família.
        </p>
        <Button onClick={() => window.location.href = '/dashboard/settings'}>
          Ir para Configurações
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="h-8 w-8" />
            Orçamentos
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus limites de gastos mensais
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026].map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingBudget(null); setSelectedCategory(''); setBudgetAmount(''); }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                            {cat.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor do Orçamento (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {months[selectedMonth - 1]} de {selectedYear}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveBudget} disabled={!selectedCategory || !budgetAmount}>
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orçado</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {totalBudgeted.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalSpent > totalBudgeted ? 'text-destructive' : 'text-foreground'}`}>
              R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disponível</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalBudgeted - totalSpent < 0 ? 'text-destructive' : 'text-success'}`}>
              R$ {(totalBudgeted - totalSpent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget List */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Orçamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {budgetStatus.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum orçamento configurado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {budgetStatus.map((budget) => {
                const status = getStatusBadge(Number(budget.spent_amount), Number(budget.budgeted_amount));
                const percentage = budget.budgeted_amount > 0 
                  ? Math.min((Number(budget.spent_amount) / Number(budget.budgeted_amount)) * 100, 100) 
                  : 0;
                const StatusIcon = status.icon;

                return (
                  <div key={budget.category_id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: budget.category_color }}
                        />
                        <span className="font-medium">{budget.category_name}</span>
                        <Badge variant={status.variant} className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {status.text}
                        </Badge>
                      </div>
                      
                      {Number(budget.budgeted_amount) > 0 && (
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(budget)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteBudget(budget.category_id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Progress 
                        value={percentage} 
                        className={`h-2 ${getStatusColor(Number(budget.spent_amount), Number(budget.budgeted_amount))}`}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          Gasto: R$ {Number(budget.spent_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span>
                          Orçado: R$ {Number(budget.budgeted_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Budgets;
