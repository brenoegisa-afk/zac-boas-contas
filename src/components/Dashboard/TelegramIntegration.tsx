import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, ExternalLink, MessageCircle, CheckCircle, AlertCircle, Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import TelegramSetupGuide from "./TelegramSetupGuide";

const TelegramIntegration = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [telegramIntegration, setTelegramIntegration] = useState<any>(null);

  // Check if user already has Telegram connected
  useEffect(() => {
    const checkTelegramConnection = async () => {
      if (!user) return;
      
      const { data: integration } = await supabase
        .from('telegram_integrations')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (integration) {
        setIsConnected(true);
        setTelegramUsername(integration.telegram_username || `@${integration.telegram_user_id}`);
        setTelegramIntegration(integration);
      }
    };

    checkTelegramConnection();
  }, [user]);

  if (showSetupGuide) {
    return (
      <div>
        <Button 
          variant="outline" 
          onClick={() => setShowSetupGuide(false)}
          className="mb-4"
        >
          ← Voltar para Integração
        </Button>
        <TelegramSetupGuide />
      </div>
    );
  }

  const webhookUrl = `https://jkvnriakyjgubifmrkso.supabase.co/functions/v1/telegram-webhook`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "URL copiada para a área de transferência",
    });
  };

  const handleConnectTelegram = async () => {
    if (!telegramUsername.trim()) {
      toast({
        title: "Erro",
        description: "Digite seu nome de usuário do Telegram",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Note: In a real implementation, you would need the actual Telegram user ID
      // This is just a placeholder - the actual connection would happen through the bot
      const telegramUserId = Math.floor(Math.random() * 1000000000); // Placeholder
      
      const { error } = await supabase
        .from('telegram_integrations')
        .upsert({
          user_id: user?.id,
          telegram_user_id: telegramUserId,
          telegram_username: telegramUsername.trim().replace('@', ''),
          verified_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsConnected(true);
      toast({
        title: "Telegram conectado!",
        description: "Agora você pode enviar transações via Telegram. Note: Esta é uma conexão de demonstração.",
      });
    } catch (error) {
      console.error('Error connecting Telegram:', error);
      toast({
        title: "Erro",
        description: "Erro ao conectar Telegram. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Integração com Telegram</h2>
        <p className="text-muted-foreground">
          Configure o bot do Telegram para registrar transações via mensagem
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Status da Integração
          </CardTitle>
          <CardDescription>
            Estado atual da conexão com o Telegram
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Conectado
                </Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <Badge variant="secondary">
                  Não conectado
                </Badge>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connection Setup */}
      {!isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>1. Conectar sua conta</CardTitle>
            <CardDescription>
              Vincule seu perfil ao Telegram para começar a usar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Demonstração:</strong> Para uma conexão real com o Telegram, você precisa iniciar uma conversa com o bot e seguir o processo de verificação segura.
              </AlertDescription>
            </Alert>
            <div>
              <Label htmlFor="telegram-username">Nome de usuário do Telegram</Label>
              <Input
                id="telegram-username"
                placeholder="@seuusuario"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value.replace('@', ''))}
              />
            </div>
            <Button 
              onClick={handleConnectTelegram}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? "Conectando..." : "Conectar Telegram (Demo)"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bot Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>2. Configurar o Bot do Telegram</CardTitle>
          <CardDescription>
            Instruções para criar e configurar seu bot no Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Administradores:</strong> Este passo só precisa ser feito uma vez por organização.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">1</Badge>
              <div>
                <p>Abra o Telegram e procure por <strong>@BotFather</strong></p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">2</Badge>
              <div>
                <p>Digite <code>/newbot</code> e siga as instruções</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">3</Badge>
              <div>
                <p>Copie o token do bot e configure no painel de administração</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">4</Badge>
              <div>
                <p>Configure o webhook do bot com esta URL:</p>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>3. Como Usar</CardTitle>
          <CardDescription>
            Formatos de mensagem aceitos pelo bot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">💸 Para registrar gastos:</h4>
            <div className="space-y-1 text-sm">
              <p><code>gasto 50 almoço</code></p>
              <p><code>despesa 25.50 café</code></p>
              <p><code>-30 transporte</code></p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">💰 Para registrar receitas:</h4>
            <div className="space-y-1 text-sm">
              <p><code>receita 1000 salário</code></p>
              <p><code>renda 500 freelance</code></p>
              <p><code>+200 venda</code></p>
            </div>
          </div>
          
          <Alert>
            <MessageCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Dica:</strong> O bot tentará categorizar automaticamente suas transações baseado na descrição.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Documentation Link */}
      <Card>
        <CardHeader>
          <CardTitle>Precisa de ajuda?</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <Bot className="h-4 w-4 mr-2" />
            Guia de Configuração do Bot
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowSetupGuide(true)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver documentação completa
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramIntegration;