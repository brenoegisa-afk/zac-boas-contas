import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const SecurityNotice = () => {
  return (
    <Alert className="border-green-200 bg-green-50">
      <Shield className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">✅ Configurações de Segurança Aplicadas</AlertTitle>
      <AlertDescription className="text-green-700 space-y-2">
        <p>Implementamos várias melhorias de segurança para proteger seus dados:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ Políticas de segurança do banco corrigidas (RLS)</li>
          <li>✅ Autenticação do bot Telegram com mapeamento seguro de usuários</li>
          <li>✅ Validação aprimorada de entrada em todos os formulários</li>
          <li>✅ Verificação de segurança de webhook implementada</li>
          <li>✅ Sanitização de dados para prevenir ataques XSS</li>
          <li>✅ Validação de entrada para prevenir SQL injection</li>
        </ul>
        <div className="pt-2">
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://supabase.com/dashboard/project/jkvnriakyjgubifmrkso/auth/providers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              Configure Auth Settings
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SecurityNotice;