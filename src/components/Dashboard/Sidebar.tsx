import { Home, Plus, Receipt, TrendingUp, Users, Settings, LogOut, MessageCircle, BarChart3, Sparkles, Wallet } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const menuItems = [
  { 
    title: 'Dashboard', 
    url: '/dashboard', 
    icon: Home,
    description: 'Visão geral das suas finanças'
  },
  { 
    title: 'Nova Transação', 
    url: '/dashboard/transactions/new', 
    icon: Plus,
    description: 'Adicionar nova receita ou despesa',
    highlight: true
  },
  { 
    title: 'Transações', 
    url: '/dashboard/transactions', 
    icon: Receipt,
    description: 'Histórico de movimentações'
  },
  { 
    title: 'Orçamentos', 
    url: '/dashboard/budgets', 
    icon: Wallet,
    description: 'Limites de gastos mensais'
  },
  { 
    title: 'Analytics', 
    url: '/dashboard/analytics', 
    icon: BarChart3,
    description: 'Análises e gráficos'
  },
  { 
    title: 'Telegram', 
    url: '/dashboard#telegram', 
    icon: MessageCircle,
    description: 'Integração com bot'
  },
  { 
    title: 'Configurações', 
    url: '/dashboard/settings', 
    icon: Settings,
    description: 'Ajustes da conta'
  },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path.includes('#')) {
      return currentPath === '/dashboard' && window.location.hash === path.split('#')[1];
    }
    return currentPath === path;
  };

  const getNavClass = ({ isActive }: { isActive: boolean }, item?: any) => {
    const baseClass = "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02]";
    
    if (isActive) {
      return `${baseClass} bg-gradient-primary text-primary-foreground shadow-glow`;
    }
    
    if (item?.highlight) {
      return `${baseClass} bg-gradient-success text-success-foreground hover:shadow-card`;
    }
    
    return `${baseClass} text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`;
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <Sidebar
      className={`${collapsed ? 'w-20' : 'w-72'} border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
                Zac
              </h2>
              <p className="text-xs text-sidebar-foreground/60 font-medium">
                Boas Contas
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavClass({ isActive: active }, item)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                            active 
                              ? 'bg-primary-foreground/20' 
                              : item.highlight 
                                ? 'bg-success-foreground/20'
                                : 'bg-sidebar-accent/50 group-hover:bg-sidebar-accent'
                          }`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          {!collapsed && (
                            <div className="flex-1 min-w-0">
                              <span className="block font-medium">
                                {item.title}
                              </span>
                              <span className="block text-xs opacity-60 truncate">
                                {item.description}
                              </span>
                            </div>
                          )}
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <div className="space-y-3">
          {!collapsed && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
                  {getInitials(user?.email || 'Usuario')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.email?.split('@')[0] || 'Usuário'}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  Conta Premium
                </p>
              </div>
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={signOut}
            className={`w-full transition-all duration-200 hover:scale-[1.02] ${
              collapsed ? 'h-10 w-10 p-0' : 'justify-start gap-2'
            }`}
            size={collapsed ? "icon" : "default"}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Sair da Conta"}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}