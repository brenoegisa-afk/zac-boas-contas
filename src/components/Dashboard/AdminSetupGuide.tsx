import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, ExternalLink, CheckCircle, AlertCircle, Bot, Settings, Users, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminSetupGuide = () => {
  const { toast } = useToast();
  const [botToken, setBotToken] = useState('');
  const [webhookConfigured, setWebhookConfigured] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const webhookUrl = `https://jkvnriakyjgubifmrkso.supabase.co/functions/v1/telegram-webhook`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência",
    });
  };

  const steps = [
    {
      id: 1,
      title: "Criar Bot no Telegram",
      description: "Configure o bot oficial no BotFather"
    },
    {
      id: 2,
      title: "Configurar Token",
      description: "Adicione o token do bot ao sistema"
    },
    {
      id: 3,
      title: "Configurar Webhook",
      description: "Conecte o bot ao sistema"
    },
    {
      id: 4,
      title: "Testar Integração",
      description: "Verifique se tudo funciona"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configuração de Administrador</h2>
        <p className="text-muted-foreground">
          Guia completo para configurar o bot do Telegram na sua organização
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Progresso da Configuração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${currentStep >= step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-4
                    ${currentStep > step.id ? 'bg-primary' : 'bg-muted'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Passo {currentStep} de {steps.length}: {steps[currentStep - 1]?.description}
          </p>
        </CardContent>
      </Card>

      {/* Step 1: Create Bot */}
      <Card className={currentStep === 1 ? 'ring-2 ring-primary' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Passo 1: Criar Bot no Telegram
          </CardTitle>
          <CardDescription>
            Configure um bot oficial no Telegram usando o BotFather
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Esta configuração deve ser feita apenas uma vez por administrador da organização.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">1</Badge>
              <div>
                <p className="font-medium">Abra o Telegram e procure por <code>@BotFather</code></p>
                <Button variant="outline" size="sm" className="mt-2">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir BotFather
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">2</Badge>
              <div>
                <p>Envie o comando <code>/newbot</code> para o BotFather</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard('/newbot')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar comando
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">3</Badge>
              <div>
                <p>Escolha um nome para seu bot (ex: "Zac Finanças Bot")</p>
                <p className="text-sm text-muted-foreground">Este nome aparecerá nos chats</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">4</Badge>
              <div>
                <p>Escolha um username único terminado em "bot" (ex: "zac_financas_bot")</p>
                <p className="text-sm text-muted-foreground">Este será o @ do seu bot</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">5</Badge>
              <div>
                <p className="font-medium">Copie o token fornecido pelo BotFather</p>
                <p className="text-sm text-muted-foreground">Formato: 123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11</p>
              </div>
            </div>
          </div>

          <Button 
            className="w-full gap-2"
            onClick={() => setCurrentStep(2)}
          >
            Bot Criado - Próximo Passo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Step 2: Configure Token */}
      <Card className={currentStep === 2 ? 'ring-2 ring-primary' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Passo 2: Configurar Token do Bot
          </CardTitle>
          <CardDescription>
            Adicione o token do bot ao sistema para integração
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-token">Token do Bot</Label>
            <Input
              id="bot-token"
              placeholder="123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Cole aqui o token que o BotFather forneceu
            </p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              O token será armazenado de forma segura e criptografada no Supabase. Nunca compartilhe este token publicamente.
            </AlertDescription>
          </Alert>

          <Button 
            disabled={!botToken.trim()}
            className="w-full gap-2"
            onClick={() => setCurrentStep(3)}
          >
            Salvar Token - Próximo Passo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Step 3: Configure Webhook */}
      <Card className={currentStep === 3 ? 'ring-2 ring-primary' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Passo 3: Configurar Webhook
          </CardTitle>
          <CardDescription>
            Configure o webhook para receber mensagens do Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>URL do Webhook</Label>
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <code className="text-sm break-all">{webhookUrl}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(webhookUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-medium">Para configurar o webhook, use um dos métodos:</p>
            
            <div className="space-y-2">
              <h4 className="font-medium">Método 1: Via API (Recomendado)</h4>
              <p className="text-sm text-muted-foreground">Execute este comando curl:</p>
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-xs break-all">
                  {`curl -X POST "https://api.telegram.org/bot${botToken || 'SEU_TOKEN'}/setWebhook" -d "url=${webhookUrl}"`}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => copyToClipboard(`curl -X POST "https://api.telegram.org/bot${botToken}/setWebhook" -d "url=${webhookUrl}"`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Método 2: Via Navegador</h4>
              <p className="text-sm text-muted-foreground">Acesse esta URL no navegador:</p>
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-xs break-all">
                  {`https://api.telegram.org/bot${botToken || 'SEU_TOKEN'}/setWebhook?url=${encodeURIComponent(webhookUrl)}`}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => copyToClipboard(`https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button 
            className="w-full gap-2"
            onClick={() => setCurrentStep(4)}
          >
            Webhook Configurado - Próximo Passo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Step 4: Test */}
      <Card className={currentStep === 4 ? 'ring-2 ring-primary' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Passo 4: Testar a Integração
          </CardTitle>
          <CardDescription>
            Verifique se a integração está funcionando corretamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Agora os usuários podem procurar pelo seu bot no Telegram e começar a usar para registrar transações.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium">Como testar:</h4>
            <div className="space-y-2 text-sm">
              <p>1. Procure pelo seu bot no Telegram (@seu_bot_username)</p>
              <p>2. Inicie uma conversa com <code>/start</code></p>
              <p>3. Tente enviar uma transação: <code>gasto 50 almoço</code></p>
              <p>4. Verifique se a transação aparece no sistema</p>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Guia do Usuário
            </Button>
            <Button className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Configuração Completa
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetupGuide;