import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, DollarSign, Receipt } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import TelegramIntegration from '@/components/Dashboard/TelegramIntegration';
import TestingGuide from '@/components/Dashboard/TestingGuide';
import FamilyOnboarding from '@/components/Dashboard/FamilyOnboarding';
import QuickActions from '@/components/Dashboard/QuickActions';

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [hasFamily, setHasFamily] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
  });

  // Check URL hash to determine active section
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash === 'telegram') {
      setActiveSection('telegram');
    } else if (hash === 'testing') {
      setActiveSection('testing');
    }
  }, []);

  // Check if user has family and load stats
  useEffect(() => {
    const checkFamilyAndLoadStats = async () => {
      if (!user) return;

      try {
        // Check if user has family
        const { data: familyMembers } = await supabase
          .from('family_members')
          .select('family_id')
          .eq('user_id', user.id);

        const userHasFamily = familyMembers && familyMembers.length > 0;
        setHasFamily(userHasFamily);

        if (userHasFamily) {
          const familyIds = familyMembers.map(fm => fm.family_id);

          // Get transactions from user's families
          const { data: transactions } = await supabase
            .from('transactions')
            .select('type, amount')
            .in('family_id', familyIds);

          if (transactions) {
            const income = transactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + Number(t.amount), 0);

            const expenses = transactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + Number(t.amount), 0);

            setStats({
              totalIncome: income,
              totalExpenses: expenses,
              balance: income - expenses,
              transactionCount: transactions.length,
            });
          }
        }
      } catch (error) {
        console.error('Error checking family and loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    checkFamilyAndLoadStats();
  }, [user]);

  const handleFamilyCreated = (familyId: string) => {
    setHasFamily(true);
    setLoading(false);
  };

  if (activeSection === 'telegram') {
    return <TelegramIntegration />;
  }

  if (activeSection === 'testing') {
    return <TestingGuide />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show onboarding if user doesn't have a family
  if (hasFamily === false) {
    return <FamilyOnboarding onFamilyCreated={handleFamilyCreated} />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Aqui está um resumo das suas finanças.
          </p>
        </div>
        <Button className="gap-2" onClick={() => window.location.href = '/dashboard/transactions/new'}>
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de entradas este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de saídas este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Receitas - Despesas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <Receipt className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.transactionCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de transações
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Taxa de Poupança</span>
              <span className="text-sm text-muted-foreground">
                {stats.totalIncome > 0 
                  ? `${((stats.balance / stats.totalIncome) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all" 
                style={{ 
                  width: stats.totalIncome > 0 
                    ? `${Math.max(0, (stats.balance / stats.totalIncome) * 100)}%`
                    : '0%'
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.balance >= 0 
                ? 'Parabéns! Você está poupando dinheiro.'
                : 'Atenção: suas despesas estão maiores que as receitas.'
              }
            </p>
          </CardContent>
        </Card>

        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;