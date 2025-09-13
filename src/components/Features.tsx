import { 
  Calculator, 
  TrendingUp, 
  Users, 
  Bell, 
  BarChart3, 
  CreditCard,
  Target,
  Heart
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Calculator,
      title: "Controle de Receitas e Despesas",
      description: "Organize entradas e saídas com categorias personalizadas para sua família.",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "Gestão Colaborativa",
      description: "Todos os membros da família participam do controle financeiro em tempo real.",
      color: "text-secondary"
    },
    {
      icon: Target,
      title: "Metas Financeiras",
      description: "Defina e acompanhe objetivos de poupança, quitação de dívidas e investimentos.",
      color: "text-accent"
    },
    {
      icon: Bell,
      title: "Alertas Inteligentes",
      description: "Receba lembretes de vencimento de contas e progresso das suas metas.",
      color: "text-warning"
    },
    {
      icon: BarChart3,
      title: "Relatórios e Dashboards",
      description: "Visualize seu progresso financeiro com gráficos claros e intuitivos.",
      color: "text-primary"
    },
    {
      icon: CreditCard,
      title: "Gestão de Cartões",
      description: "Controle cartões de crédito, parcelamentos e limite disponível.",
      color: "text-secondary"
    },
    {
      icon: TrendingUp,
      title: "Planejamento Anual",
      description: "Organize suas finanças com visão de longo prazo e metas anuais.",
      color: "text-success"
    },
    {
      icon: Heart,
      title: "Valores Cristãos",
      description: "Ferramenta baseada em princípios bíblicos de mordomia e responsabilidade.",
      color: "text-destructive"
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-card px-4 py-2 rounded-full shadow-card border mb-6">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Funcionalidades</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Tudo que sua família precisa para
            <span className="bg-gradient-hero bg-clip-text text-transparent"> organizar as finanças</span>
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Uma plataforma completa e intuitiva que transforma o controle financeiro 
            em um hábito familiar saudável e baseado em propósito.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-card rounded-xl p-6 shadow-card border hover:shadow-elegant transition-smooth hover:-translate-y-1"
              >
                <div className="mb-4">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br from-background to-muted/50 ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-smooth">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-card rounded-2xl p-8 lg:p-12 shadow-elegant border">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Pronto para transformar suas <span className="bg-gradient-hero bg-clip-text text-transparent">finanças familiares</span>?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Junte-se a centenas de famílias que já organizaram suas finanças 
              e conquistaram seus sonhos com o Zac - Boas Contas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button className="bg-gradient-premium text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-glow transform hover:scale-105 transition-bounce">
                Começar Gratuitamente
              </button>
              <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-8 py-3 rounded-lg font-medium transition-smooth">
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;