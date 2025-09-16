import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, AlertTriangle, Info, ExternalLink, MessageCircle, Database, Users, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TestingGuide = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência",
    });
  };

  const testCases = [
    {
      category: "Autenticação",
      icon: Users,
      tests: [
        "Registrar nova conta com email válido",
        "Fazer login com credenciais válidas",
        "Testar logout e redirecionamento",
        "Verificar proteção de rotas privadas"
      ]
    },
    {
      category: "Famílias",
      icon: Users,
      tests: [
        "Criar nova família",
        "Verificar se usuário vira admin automaticamente",
        "Visualizar membros da família",
        "Testar permissões de administrador"
      ]
    },
    {
      category: "Transações",
      icon: Database,
      tests: [
        "Criar nova receita",
        "Criar nova despesa",
        "Editar transação existente",
        "Excluir transação",
        "Filtrar por tipo e descrição",
        "Visualizar estatísticas no dashboard"
      ]
    },
    {
      category: "Telegram Bot",
      icon: MessageCircle,
      tests: [
        "Conectar conta ao Telegram",
        "Configurar webhook do bot",
        "Testar comando /start",
        "Registrar transação: 'gasto 50 almoço'",
        "Registrar transação: 'receita 1000 salário'",
        "Testar formato: '-25.50 café'",
        "Verificar categorização automática"
      ]
    }
  ];

  const telegramCommands = [
    "gasto 50 almoço",
    "receita 1000 salário", 
    "-25.50 café da manhã",
    "+200 venda produto",
    "despesa 30 transporte",
    "renda 500 freelance"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Guia de Testes Completo
        </h2>
        <p className="text-muted-foreground">
          Siga este guia para testar todas as funcionalidades do sistema
        </p>
      </div>

      {/* Pre-requisites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Pré-requisitos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Antes de começar os testes, certifique-se de que:
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2 ml-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="min-w-[20px] h-5 flex items-center justify-center">1</Badge>
              <span className="text-sm">Sistema está executando (npm run dev)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="min-w-[20px] h-5 flex items-center justify-center">2</Badge>
              <span className="text-sm">Supabase está configurado e ativo</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="min-w-[20px] h-5 flex items-center justify-center">3</Badge>
              <span className="text-sm">Token do Telegram Bot foi configurado</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="min-w-[20px] h-5 flex items-center justify-center">4</Badge>
              <span className="text-sm">Webhook do Telegram está ativo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Steps */}
      {testCases.map((category, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="min-w-[24px] h-6 flex items-center justify-center">{index + 1}</Badge>
              <category.icon className="h-5 w-5" />
              Teste: {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {category.tests.map((test, testIndex) => (
                <div key={testIndex} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{test}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Telegram Testing Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comandos para Testar o Telegram
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <MessageCircle className="h-4 w-4" />
            <AlertDescription>
              Use estes comandos no seu bot do Telegram para testar diferentes cenários:
            </AlertDescription>
          </Alert>

          <div className="grid gap-2">
            {telegramCommands.map((command, index) => (
              <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-lg">
                <code className="text-sm">{command}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(command)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Dica:</strong> Teste também comandos inválidos como "abc 123 def" para verificar se o bot responde com mensagem de erro adequada.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Expected Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Resultados Esperados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-green-600">✅ Sucesso</h4>
              <div className="space-y-2 text-sm">
                <p>• Usuário consegue se registrar e fazer login</p>
                <p>• Dashboard mostra estatísticas corretas</p>
                <p>• Transações são criadas e exibidas</p>
                <p>• Bot responde com confirmação de transação</p>
                <p>• Categorização automática funciona</p>
                <p>• Filtros e busca funcionam corretamente</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-red-600">❌ Problemas Comuns</h4>
              <div className="space-y-2 text-sm">
                <p>• Erro 404 no webhook (verificar URL)</p>
                <p>• Bot não responde (verificar token)</p>
                <p>• Transações não aparecem (verificar RLS)</p>
                <p>• Usuário não encontrado (verificar vinculação)</p>
                <p>• Família não encontrada (verificar membership)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debugging Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dicas de Debugging
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Se algo não estiver funcionando, verifique estes pontos:
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href="https://supabase.com/dashboard/project/jkvnriakyjgubifmrkso/functions/telegram-webhook/logs" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Ver Logs do Edge Function
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href="https://supabase.com/dashboard/project/jkvnriakyjgubifmrkso/auth/users" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Verificar Usuários Cadastrados
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href="https://supabase.com/dashboard/project/jkvnriakyjgubifmrkso/sql/new" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Executar Queries SQL
              </a>
            </Button>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium mb-2">Comandos SQL Úteis:</p>
            <div className="space-y-1 text-xs font-mono">
              <div className="flex items-center justify-between">
                <code>SELECT * FROM profiles;</code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard("SELECT * FROM profiles;")}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <code>SELECT * FROM families;</code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard("SELECT * FROM families;")}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <code>SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;</code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;")}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestingGuide;