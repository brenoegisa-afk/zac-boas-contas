import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Heart, Users } from "lucide-react";
import heroImage from "@/assets/hero-family-finance.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-20 pb-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-card px-4 py-2 rounded-full shadow-card border">
              <Heart className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Inspirado em valores cristãos</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Zac - Boas Contas
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground font-medium">
                Controle financeiro familiar com <strong className="text-primary">propósito</strong>
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-xl lg:max-w-none">
              Transforme a relação da sua família com o dinheiro. 
              Organize receitas, despesas e metas com uma ferramenta simples, 
              prática e baseada em valores cristãos.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:max-w-none lg:mx-0">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Controle colaborativo</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Metas familiares</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Relatórios inteligentes</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Valores cristãos</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <Button variant="premium" size="xl" className="w-full sm:w-auto group">
                <Users className="h-5 w-5" />
                Começar Grátis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Ver Demonstração
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full border-2 border-background"></div>
                  <div className="w-8 h-8 bg-gradient-success rounded-full border-2 border-background"></div>
                  <div className="w-8 h-8 bg-accent rounded-full border-2 border-background"></div>
                </div>
                <span>+500 famílias organizadas</span>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative lg:order-last">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={heroImage}
                alt="Família cristã organizando suas finanças com o Zac"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating Stats Cards */}
            <div className="absolute -top-6 -left-6 bg-gradient-card rounded-xl p-4 shadow-card border backdrop-blur-sm">
              <div className="text-2xl font-bold text-success">R$ 2.847</div>
              <div className="text-sm text-muted-foreground">Economizado este mês</div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-gradient-card rounded-xl p-4 shadow-card border backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Das metas alcançadas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;