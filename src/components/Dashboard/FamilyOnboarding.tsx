import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, ArrowRight, Home, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FamilyOnboardingProps {
  onFamilyCreated: (familyId: string) => void;
}

const FamilyOnboarding: React.FC<FamilyOnboardingProps> = ({ onFamilyCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para sua família",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);

    try {
      // Create family
      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          created_by: user?.id
        })
        .select()
        .single();

      if (familyError) throw familyError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: family.id,
          user_id: user?.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      toast({
        title: "Família criada!",
        description: "Sua família foi configurada com sucesso.",
      });

      onFamilyCreated(family.id);
    } catch (error) {
      console.error('Error creating family:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar família. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Home className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Bem-vindo ao Zac!</h1>
        <p className="text-muted-foreground">
          Vamos configurar sua primeira família para começar a gerenciar as finanças
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Uma família é um grupo de pessoas que compartilham finanças. Você pode adicionar membros posteriormente e gerenciar permissões.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Criar Sua Família
          </CardTitle>
          <CardDescription>
            Configure sua família para começar a usar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateFamily} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="family-name">Nome da Família *</Label>
              <Input
                id="family-name"
                placeholder="Ex: Família Silva, Casa dos João..."
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="family-description">Descrição (opcional)</Label>
              <Textarea
                id="family-description"
                placeholder="Descreva sua família ou o propósito do grupo financeiro..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              disabled={creating} 
              className="w-full gap-2"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando...
                </>
              ) : (
                <>
                  Criar Família
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium">Próximos passos após criar a família:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Configurar categorias de receitas e despesas</li>
              <li>✓ Conectar o bot do Telegram para transações rápidas</li>
              <li>✓ Convidar outros membros da família</li>
              <li>✓ Começar a registrar transações</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyOnboarding;