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
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 text-primary-foreground shadow-elegant">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Olá, {user?.email?.split('@')[0] || 'Usuário'}! 👋
              </h1>
              <p className="text-primary-foreground/80 text-lg">
                Aqui está um resumo das suas finanças hoje
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="lg"
              className="gap-2 shadow-card hover:shadow-glow transform hover:scale-105 transition-all"
              onClick={() => window.location.href = '/dashboard/transactions/new'}
            >
              <Plus className="h-5 w-5" />
              Nova Transação
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden bg-gradient-card border-0 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-success opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-success mb-1">
              {formatCurrency(stats.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de entradas este mês
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-gradient-card border-0 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-destructive/5 group-hover:from-destructive/20 group-hover:to-destructive/10 transition-all"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-destructive mb-1">
              {formatCurrency(stats.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de saídas este mês
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-gradient-card border-0 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
          <div className={`absolute inset-0 ${stats.balance >= 0 ? 'bg-gradient-success' : 'bg-gradient-to-br from-destructive/10 to-destructive/5'} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Atual</CardTitle>
            <div className={`h-10 w-10 rounded-lg ${stats.balance >= 0 ? 'bg-success/10' : 'bg-destructive/10'} flex items-center justify-center`}>
              <DollarSign className={`h-5 w-5 ${stats.balance >= 0 ? 'text-success' : 'text-destructive'}`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-3xl font-bold mb-1 ${stats.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(stats.balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Receitas - Despesas
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-gradient-card border-0 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transações</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.transactionCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de movimentações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-gradient-card border-0 shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taxa de Poupança</span>
                <span className="text-lg font-bold text-primary">
                  {stats.totalIncome > 0 
                    ? `${((stats.balance / stats.totalIncome) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-primary h-3 rounded-full transition-all duration-700 ease-out shadow-glow" 
                  style={{ 
                    width: stats.totalIncome > 0 
                      ? `${Math.max(0, Math.min(100, (stats.balance / stats.totalIncome) * 100))}%`
                      : '0%'
                  }}
                ></div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${stats.balance >= 0 ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'}`}>
              <p className={`text-sm font-medium ${stats.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                {stats.balance >= 0 
                  ? '🎉 Parabéns! Você está no caminho certo para suas metas financeiras.'
                  : '⚠️ Atenção: suas despesas estão maiores que as receitas. Considere revisar seus gastos.'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(Math.max(0, stats.balance))}
                </p>
                <p className="text-xs text-muted-foreground">Valor Poupado</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {stats.totalIncome > 0 
                    ? Math.round(stats.totalExpenses / stats.totalIncome * 100)
                    : 0
                  }%
                </p>
                <p className="text-xs text-muted-foreground">Taxa de Gastos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;