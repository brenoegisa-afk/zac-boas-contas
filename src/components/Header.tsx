import { Button } from "@/components/ui/button";
import { DollarSign, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 w-full bg-card/95 backdrop-blur-sm border-b border-border z-50 shadow-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-foreground hover:text-primary transition-smooth">
              Funcionalidades
            </a>
            <a href="#plans" className="text-foreground hover:text-primary transition-smooth">
              Planos
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-smooth">
              Sobre
            </a>
            <Button variant="outline" size="sm">
              Entrar
            </Button>
            <Button variant="hero" size="sm">
              Começar Grátis
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-smooth"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-card">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-foreground hover:text-primary transition-smooth px-2 py-1"
                onClick={toggleMenu}
              >
                Funcionalidades
              </a>
              <a 
                href="#plans" 
                className="text-foreground hover:text-primary transition-smooth px-2 py-1"
                onClick={toggleMenu}
              >
                Planos
              </a>
              <a 
                href="#about" 
                className="text-foreground hover:text-primary transition-smooth px-2 py-1"
                onClick={toggleMenu}
              >
                Sobre
              </a>
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
                <Button variant="hero" size="sm">
                  Começar Grátis
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;