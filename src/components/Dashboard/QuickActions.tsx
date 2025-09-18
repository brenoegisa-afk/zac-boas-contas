import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, MessageCircle, Settings, BarChart, Users } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Nova Transação",
      description: "Registrar receita ou despesa",
      icon: <Plus className="h-5 w-5" />,
      href: "/dashboard/transactions/new",
      variant: "default" as const
    },
    {
      title: "Ver Transações",
      description: "Histórico completo",
      icon: <Receipt className="h-5 w-5" />,
      href: "/dashboard/transactions",
      variant: "outline" as const
    },
    {
      title: "Telegram Bot",
      description: "Configurar integração",
      icon: <MessageCircle className="h-5 w-5" />,
      href: "/dashboard#telegram",
      variant: "outline" as const
    },
    {
      title: "Relatórios",
      description: "Análises financeiras",
      icon: <BarChart className="h-5 w-5" />,
      href: "/dashboard/reports",
      variant: "outline" as const
    },
    {
      title: "Gerenciar Família",
      description: "Membros e permissões",
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/family",
      variant: "outline" as const
    },
    {
      title: "Configurações",
      description: "Preferências do sistema",
      icon: <Settings className="h-5 w-5" />,
      href: "/dashboard/settings",
      variant: "outline" as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-auto p-4 justify-start gap-3"
              onClick={() => window.location.href = action.href}
            >
              <div className="flex items-center gap-3">
                {action.icon}
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;