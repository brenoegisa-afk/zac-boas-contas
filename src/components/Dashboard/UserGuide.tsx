import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MessageCircle, 
  DollarSign, 
  Receipt, 
  Bot, 
  ExternalLink, 
  Info,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Smartphone
} from "lucide-react";

const UserGuide = () => {
  const exampleCommands = [
    {
      category: 'Despesas',
      icon: <TrendingDown className="h-4 w-4 text-red-500" />,
      commands: [
        { text: 'gasto 50 almoço', description: 'Registra R$ 50 gasto com almoço' },
        { text: 'despesa 25.50 café', description: 'Registra R$ 25,50 gasto com café' },
        { text: '-120 supermercado', description: 'Registra R$ 120 gasto no supermercado' },
        { text: 'paguei 80 gasolina', description: 'Registra R$ 80 gasto com gasolina' }
      ]
    },
    {
      category: 'Receitas',
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      commands: [
        { text: 'receita 3000 salário', description: 'Registra R$ 3.000 de salário' },
        { text: 'renda 500 freelance', description: 'Registra R$ 500 de freelance' },
        { text: '+200 venda', description: 'Registra R$ 200 de uma venda' },
        { text: 'ganhei 150 bonificação', description: 'Registra R$ 150 de bonificação' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Como Usar o Bot do Telegram</h2>
        <p className="text-muted-foreground">
          Aprenda a registrar transações rapidamente via Telegram
        </p>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Primeiros Passos
          </CardTitle>
          <CardDescription>
            Configure sua conta para usar o bot do Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium">Procure o Bot</h4>
              <p className="text-sm text-muted-foreground">
                No Telegram, procure pelo bot da sua organização
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h4 className="font-medium">Inicie a Conversa</h4>
              <p className="text-sm text-muted-foreground">
                Envie /start e siga as instruções de conexão
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-medium">Comece a Usar</h4>
              <p className="text-sm text-muted-foreground">
                Envie suas transações usando comandos simples
              </p>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Dica:</strong> Após conectar sua conta, todas as transações enviadas pelo Telegram aparecerão automaticamente no dashboard.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Command Examples */}
      {exampleCommands.map((category, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {category.icon}
              {category.category}
            </CardTitle>
            <CardDescription>
              Exemplos de comandos para registrar {category.category.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {category.commands.map((command, cmdIndex) => (
                <div key={cmdIndex} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {command.text}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{command.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Recursos Avançados
          </CardTitle>
          <CardDescription>
            Funcionalidades extras do bot para maior produtividade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Categorização Automática
              </h4>
              <p className="text-sm text-muted-foreground">
                O bot tenta categorizar automaticamente suas transações baseado na descrição
              </p>
              <div className="text-xs space-y-1">
                <p>• "almoço" → Alimentação</p>
                <p>• "uber" → Transporte</p>
                <p>• "salário" → Salário</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                Valores Flexíveis
              </h4>
              <p className="text-sm text-muted-foreground">
                Aceita diferentes formatos de valores para facilitar o uso
              </p>
              <div className="text-xs space-y-1">
                <p>• 50 ou 50.00 ou 50,50</p>
                <p>• Com ou sem R$ na frente</p>
                <p>• + para receitas, - para despesas</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Receipt className="h-4 w-4 text-purple-500" />
                Confirmação Imediata
              </h4>
              <p className="text-sm text-muted-foreground">
                Receba confirmação instantânea quando a transação for registrada
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-orange-500" />
                Comandos de Ajuda
              </h4>
              <p className="text-sm text-muted-foreground">
                Use /help a qualquer momento para ver exemplos e instruções
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips & Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Dicas e Boas Práticas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">✓ Faça</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use descrições claras e específicas</li>
                <li>• Registre transações no momento que acontecem</li>
                <li>• Use palavras-chave conhecidas para melhor categorização</li>
                <li>• Verifique periodicamente no dashboard</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">✗ Evite</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Descrições muito genéricas como "coisa"</li>
                <li>• Valores sem contexto adequado</li>
                <li>• Acumular muitas transações para registrar depois</li>
                <li>• Usar abreviações que podem confundir</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <Bot className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="font-medium">Precisa de Ajuda?</h3>
            <p className="text-sm text-muted-foreground">
              Se tiver dúvidas ou problemas, entre em contato com o administrador da sua organização
            </p>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Falar com Suporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserGuide;