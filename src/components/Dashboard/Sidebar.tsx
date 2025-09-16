import { Home, Plus, Receipt, TrendingUp, Users, Settings, LogOut, MessageCircle } from 'lucide-react';
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
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Nova Transação', url: '/dashboard/transactions/new', icon: Plus },
  { title: 'Transações', url: '/dashboard/transactions', icon: Receipt },
  { title: 'Relatórios', url: '/dashboard/reports', icon: TrendingUp },
  { title: 'Telegram', url: '/dashboard#telegram', icon: MessageCircle },
  { title: 'Configurações', url: '/dashboard/settings', icon: Settings },
  { title: 'Guia de Testes', url: '/dashboard#testing', icon: Settings },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? 'bg-primary text-primary-foreground font-medium hover:bg-primary/90' 
      : 'hover:bg-accent hover:text-accent-foreground';

  return (
    <Sidebar
      className={collapsed ? 'w-14' : 'w-64'}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <div className="p-4">
          {!collapsed && (
            <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              Zac - Boas Contas
            </h2>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button
            variant="outline"
            onClick={signOut}
            className="w-full"
            size={collapsed ? "icon" : "default"}
          >
            <LogOut className={collapsed ? "h-4 w-4" : "mr-2 h-4 w-4"} />
            {!collapsed && "Sair"}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}