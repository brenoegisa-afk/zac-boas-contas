import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Users2 } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar a organizar suas finanças",
      icon: Star,
      features: [
        "Controle básico de receitas e despesas",
        "1 usuário",
        "Relatórios simples",
        "Suporte por email",
        "Até 50 transações por mês"
      ],
      buttonText: "Começar Grátis",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Premium",
      price: "R$ 29,90",
      period: "/mês",
      description: "Solução completa para sua família",
      icon: Users2,
      features: [
        "Controle completo de receitas e despesas",
        "Até 5 usuários",
        "Metas financeiras ilimitadas",
        "Relatórios avançados com gráficos",
        "Alertas inteligentes",
        "Gestão de cartões e parcelamentos",
        "Transações ilimitadas",
        "Suporte prioritário"
      ],
      buttonText: "Escolher Premium",
      buttonVariant: "hero" as const,
      popular: true
    },
    {
      name: "Família Plus",
      price: "R$ 49,90",
      period: "/mês",
      description: "Para famílias que querem o máximo controle",
      icon: Crown,
      features: [
        "Tudo do Premium, mais:",
        "Usuários ilimitados",
        "Dashboard compartilhado avançado",
        "Planejamento financeiro anual",
        "Exportação de dados",
        "Integração com bancos (em breve)",
        "Suporte VIP com WhatsApp",
        "Consultorias mensais gratuitas"
      ],
      buttonText: "Escolher Família Plus",
      buttonVariant: "premium" as const,
      popular: false
    }
  ];

  return (
    <section id="plans" className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-card px-4 py-2 rounded-full shadow-card border mb-6">
            <Crown className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Planos e Preços</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Escolha o plano ideal para
            <span className="bg-gradient-hero bg-clip-text text-transparent"> sua família</span>
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Comece gratuitamente e evolua conforme suas necessidades. 
            Todos os planos incluem suporte e atualizações constantes.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative bg-gradient-card rounded-2xl shadow-card border transition-smooth hover:shadow-elegant hover:-translate-y-2 ${
                  plan.popular 
                    ? 'ring-2 ring-primary shadow-glow scale-105' 
                    : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-elegant">
                      Mais Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-background to-muted/50 mb-4">
                      <Icon className={`h-6 w-6 ${
                        plan.name === 'Premium' ? 'text-primary' : 
                        plan.name === 'Família Plus' ? 'text-accent' : 
                        'text-muted-foreground'
                      }`} />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                    
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button 
                    variant={plan.buttonVariant} 
                    size="lg" 
                    className="w-full"
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            ✨ Todos os planos incluem 14 dias grátis • Cancele quando quiser • Sem taxas ocultas
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-success" />
              <span>Segurança bancária</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-success" />
              <span>Dados criptografados</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-success" />
              <span>Suporte brasileiro</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;