import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const SecurityNotice = () => {
  return (
    <Alert className="border-green-200 bg-green-50">
      <Shield className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Security Updates Applied</AlertTitle>
      <AlertDescription className="text-green-700 space-y-2">
        <p>We've implemented several security improvements to protect your data:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Fixed database security policies to prevent unauthorized access</li>
          <li>Improved Telegram bot authentication with secure user mapping</li>
          <li>Enhanced input validation across all forms</li>
          <li>Added webhook security verification</li>
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