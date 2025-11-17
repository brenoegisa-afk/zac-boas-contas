import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  transaction_date: string;
  category_id: string | null;
  categories: {
    name: string;
    color: string;
  } | null;
}

interface MonthlyData {
  month: string;
  receitas: number;
  despesas: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const Analytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [period, setPeriod] = useState<'3' | '6' | '12'>('6');
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [user, period]);

  useEffect(() => {
    if (transactions.length > 0) {
      processMonthlyData();
      processCategoryData();
      calculateTotals();
    }
  }, [transactions, period]);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data: familyMembers } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id);

      if (!familyMembers || familyMembers.length === 0) {
        setLoading(false);
        return;
      }

      const familyIds = familyMembers.map(fm => fm.family_id);
      const months = parseInt(period);
      const startDate = startOfMonth(subMonths(new Date(), months - 1));

      const { data: transactionsData, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (name, color)
        `)
        .in('family_id', familyIds)
        .gte('transaction_date', startDate.toISOString().split('T')[0])
        .order('transaction_date', { ascending: true });

      if (error) throw error;

      setTransactions(transactionsData as Transaction[] || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados para análise',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = () => {
    const months = parseInt(period);
    const data: MonthlyData[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthLabel = format(date, 'MMM/yy', { locale: ptBR });

      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.transaction_date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const receitas = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const despesas = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        month: monthLabel,
        receitas,
        despesas,
      });
    }

    setMonthlyData(data);
  };

  const processCategoryData = () => {
    const categoryMap = new Map<string, { total: number; color: string }>();

    transactions
      .filter(t => t.type === 'expense' && t.categories)
      .forEach(t => {
        if (t.categories) {
          const existing = categoryMap.get(t.categories.name) || { total: 0, color: t.categories.color };
          categoryMap.set(t.categories.name, {
            total: existing.total + t.amount,
            color: t.categories.color,
          });
        }
      });

    const data: CategoryData[] = Array.from(categoryMap.entries())
      .map(([name, { total, color }]) => ({
        name,
        value: total,
        color,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    setCategoryData(data);
  };

  const calculateTotals = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setTotalIncome(income);
    setTotalExpense(expense);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const balance = totalIncome - totalExpense;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Análise detalhada das suas finanças
          </p>
        </div>
        <Select value={period} onValueChange={(value: '3' | '6' | '12') => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Últimos 3 meses</SelectItem>
            <SelectItem value="6">Últimos 6 meses</SelectItem>
            <SelectItem value="12">Últimos 12 meses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Últimos {period} meses
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Últimos {period} meses
            </p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800' : 'from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className={`h-4 w-4 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {balance >= 0 ? 'Positivo' : 'Negativo'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Line Chart - Receitas vs Despesas */}
        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
            <CardDescription>Comparação mensal ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="receitas" stroke="hsl(142, 76%, 36%)" strokeWidth={2} name="Receitas" />
                  <Line type="monotone" dataKey="despesas" stroke="hsl(0, 84%, 60%)" strokeWidth={2} name="Despesas" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhum dado disponível para o período selecionado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart - Despesas por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Despesas por Categoria
            </CardTitle>
            <CardDescription>Distribuição das maiores categorias</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma despesa categorizada no período
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Comparativo Mensal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Comparativo Mensal</CardTitle>
            <CardDescription>Visualização em barras das receitas e despesas</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Bar dataKey="receitas" fill="hsl(142, 76%, 36%)" name="Receitas" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="despesas" fill="hsl(0, 84%, 60%)" name="Despesas" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhum dado disponível para o período selecionado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category List */}
        {categoryData.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Maiores Gastos por Categoria</CardTitle>
              <CardDescription>Top 8 categorias com maior volume de despesas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          {category.name}
                        </span>
                        <span className="text-sm font-bold text-red-600">
                          {formatCurrency(category.value)}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${(category.value / totalExpense) * 100}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analytics;
