import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Bot, MessageCircle, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TelegramSetupGuide = () => {
  const { toast } = useToast();
  const webhookUrl = `https://jkvnriakyjgubifmrkso.supabase.co/functions/v1/telegram-webhook`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência",
    });
  };

  const botSetupCommands = [
    "/start",
    "/newbot", 
    "ZacBoasContasBot",
    "@ZacBoasContasBot",
    "/setcommands",
    "start - Iniciar o bot\nhelp - Mostrar ajuda\nformatos - Ver formatos de transação"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Bot className="h-6 w-6" />
          Guia de Configuração do Bot Telegram
        </h2>
        <p className="text-muted-foreground">
          Siga este guia para configurar seu bot do Telegram com o BotFather
        </p>
      </div>

      {/* Step 1: Create Bot */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className="min-w-[24px] h-6 flex items-center justify-center">1</Badge>
            Criar o Bot no BotFather
          </CardTitle>
          <CardDescription>
            Use o BotFather oficial do Telegram para criar seu bot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <MessageCircle className="h-4 w-4" />
            <AlertDescription>
              Abra o Telegram e procure por <strong>@BotFather</strong> (verificado)
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Digite os seguintes comandos:</p>
              <div className="space-y-2">
                {botSetupCommands.slice(0, 4).map((command, index) => (
                  <div key={index} className="flex items-center justify-between">
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
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• <code>/start</code> - Iniciar conversa com BotFather</p>
              <p>• <code>/newbot</code> - Criar novo bot</p>
              <p>• Digite o nome do bot (ex: "Zac Boas Contas")</p>
              <p>• Digite o username do bot (ex: "ZacBoasContasBot")</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Get Token */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className="min-w-[24px] h-6 flex items-center justify-center">2</Badge>
            Copiar o Token do Bot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              O BotFather fornecerá um token similar a: <code>123456789:ABCdefGHIjklMNOpqrsTUVwxyz</code>
            </AlertDescription>
          </Alert>
          
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Importante:</strong> Mantenha o token seguro! Ele dá acesso total ao seu bot.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Configure Webhook */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className="min-w-[24px] h-6 flex items-center justify-center">3</Badge>
            Configurar o Webhook
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm mb-2">Use esta URL como webhook:</p>
            <div className="bg-muted p-3 rounded-lg">
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
          
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium mb-2">Execute este comando via curl ou Postman:</p>
            <div className="flex items-center justify-between">
              <code className="text-xs break-all">
                curl -X POST "https://api.telegram.org/bot[SEU_TOKEN]/setWebhook" -H "Content-Type: application/json" -d '{`{"url":"${webhookUrl}"}`}'
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`curl -X POST "https://api.telegram.org/bot[SEU_TOKEN]/setWebhook" -H "Content-Type: application/json" -d '{"url":"${webhookUrl}"}'`)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Alert>
            <AlertDescription>
              Substitua <code>[SEU_TOKEN]</code> pelo token real do seu bot
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Step 4: Set Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className="min-w-[24px] h-6 flex items-center justify-center">4</Badge>
            Configurar Comandos do Bot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm mb-2">No BotFather, digite:</p>
            <div className="bg-muted p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <code className="text-sm">/setcommands</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("/setcommands")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Selecione seu bot e cole os comandos abaixo:
              </div>
              <div className="flex items-start justify-between">
                <pre className="text-xs">
{`start - Iniciar o bot
help - Mostrar ajuda
formatos - Ver formatos de transação`}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("start - Iniciar o bot\nhelp - Mostrar ajuda\nformatos - Ver formatos de transação")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 5: Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className="min-w-[24px] h-6 flex items-center justify-center">5</Badge>
            Testar o Bot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm">Teste os seguintes comandos no seu bot:</p>
            <div className="bg-muted p-3 rounded-lg space-y-1">
              <p className="text-sm"><code>/start</code> - Deve responder com mensagem de boas-vindas</p>
              <p className="text-sm"><code>/help</code> - Deve mostrar ajuda dos comandos</p>
              <p className="text-sm"><code>gasto 50 almoço</code> - Deve registrar uma transação</p>
            </div>
          </div>
          
          <Alert>
            <AlertDescription>
              <strong>Nota:</strong> Para funcionar completamente, o usuário precisa estar registrado no sistema e ter vinculado o Telegram ao perfil.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Links Úteis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <a href="https://core.telegram.org/bots#creating-a-new-bot" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Documentação oficial do Telegram Bot API
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <a href="https://core.telegram.org/bots/api#setwebhook" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Documentação sobre Webhooks
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramSetupGuide;