import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Save, DollarSign, Receipt } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  type: string;
  color: string;
  icon: string;
}

interface FormData {
  type: 'income' | 'expense';
  amount: string;
  description: string;
  category_id: string;
  notes: string;
  transaction_date: string;
}

const NewTransaction = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [familyId, setFamilyId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    type: 'expense',
    amount: '',
    description: '',
    category_id: '',
    notes: '',
    transaction_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchUserFamilyAndCategories();
  }, [user]);

  const fetchUserFamilyAndCategories = async () => {
    if (!user) return;

    try {
      // Get user's default family
      const { data: familyMembers } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)
        .limit(1);

      if (!familyMembers || familyMembers.length === 0) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar em uma família para criar transações',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }

      const userFamilyId = familyMembers[0].family_id;
      setFamilyId(userFamilyId);

      // Get categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .or(`is_default.eq.true,family_id.eq.${userFamilyId}`)
        .order('name');

      setCategories((categoriesData as Category[]) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados necessários',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!familyId) {
      toast({
        title: 'Erro',
        description: 'Família não encontrada',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.amount || !formData.description) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          family_id: familyId,
          user_id: user?.id,
          category_id: formData.category_id || null,
          type: formData.type,
          amount: parseFloat(formData.amount.replace(',', '.')),
          description: formData.description,
          notes: formData.notes || null,
          transaction_date: formData.transaction_date,
        });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Transação criada com sucesso!',
      });

      navigate('/dashboard/transactions');
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar transação',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Transação</h1>
          <p className="text-muted-foreground">
            Registre uma nova receita ou despesa
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Detalhes da Transação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type Selection */}
            <div className="space-y-3">
              <Label>Tipo de Transação</Label>
              <RadioGroup 
                value={formData.type} 
                onValueChange={(value) => handleInputChange('type', value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Receita
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-red-600" />
                    Despesa
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Valor *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.transaction_date}
                  onChange={(e) => handleInputChange('transaction_date', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                placeholder="Ex: Salário, Almoço, Conta de luz..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => handleInputChange('category_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                  {filteredCategories.length === 0 && (
                    <SelectItem value="no-categories" disabled>
                      Nenhuma categoria encontrada
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Informações adicionais sobre a transação..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Transação
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default NewTransaction;