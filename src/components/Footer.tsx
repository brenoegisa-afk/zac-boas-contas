import { DollarSign, Heart, Mail, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg shadow-card">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Zac
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">Boas Contas</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Transformando a relação das famílias com o dinheiro através de valores cristãos e organização financeira.
            </p>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-muted-foreground">Feito com</span>
              <Heart className="h-4 w-4 text-destructive" />
              <span className="text-muted-foreground">para famílias cristãs</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Produto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-smooth">Funcionalidades</a></li>
              <li><a href="#plans" className="hover:text-primary transition-smooth">Planos e Preços</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Demonstração</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Atualizações</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Tutoriais</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Contato</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Entre em Contato</h3>
            <div className="space-y-3">
              <a 
                href="mailto:contato@zacboascontas.com.br" 
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                <Mail className="h-4 w-4" />
                <span>contato@zacboascontas.com.br</span>
              </a>
              <a 
                href="#" 
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Suporte</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 Zac - Boas Contas. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-smooth">Privacidade</a>
              <a href="#" className="hover:text-primary transition-smooth">Termos</a>
              <a href="#" className="hover:text-primary transition-smooth">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;