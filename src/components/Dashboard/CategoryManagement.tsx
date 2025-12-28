import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Tags, Plus, Edit2, Trash2, 
  Home, Car, Utensils, ShoppingBag, Heart, Briefcase, 
  Plane, Gift, Music, Book, Wifi, Zap, Droplets,
  DollarSign, CreditCard, PiggyBank, TrendingUp, Wallet,
  Coffee, Pizza, Gamepad, Film, Shirt, Scissors
} from 'lucide-react';

const iconOptions = [
  { value: 'DollarSign', icon: DollarSign, label: 'Dinheiro' },
  { value: 'CreditCard', icon: CreditCard, label: 'Cartão' },
  { value: 'Home', icon: Home, label: 'Casa' },
  { value: 'Car', icon: Car, label: 'Carro' },
  { value: 'Utensils', icon: Utensils, label: 'Alimentação' },
  { value: 'ShoppingBag', icon: ShoppingBag, label: 'Compras' },
  { value: 'Heart', icon: Heart, label: 'Saúde' },
  { value: 'Briefcase', icon: Briefcase, label: 'Trabalho' },
  { value: 'Plane', icon: Plane, label: 'Viagem' },
  { value: 'Gift', icon: Gift, label: 'Presente' },
  { value: 'Music', icon: Music, label: 'Música' },
  { value: 'Book', icon: Book, label: 'Educação' },
  { value: 'Wifi', icon: Wifi, label: 'Internet' },
  { value: 'Zap', icon: Zap, label: 'Energia' },
  { value: 'Droplets', icon: Droplets, label: 'Água' },
  { value: 'PiggyBank', icon: PiggyBank, label: 'Poupança' },
  { value: 'TrendingUp', icon: TrendingUp, label: 'Investimentos' },
  { value: 'Wallet', icon: Wallet, label: 'Carteira' },
  { value: 'Coffee', icon: Coffee, label: 'Café' },
  { value: 'Pizza', icon: Pizza, label: 'Fast Food' },
  { value: 'Gamepad', icon: Gamepad, label: 'Jogos' },
  { value: 'Film', icon: Film, label: 'Entretenimento' },
  { value: 'Shirt', icon: Shirt, label: 'Roupas' },
  { value: 'Scissors', icon: Scissors, label: 'Beleza' },
];

const colorOptions = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#A855F7', '#22C55E', '#E11D48', '#0EA5E9',
];

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: string;
  is_default: boolean;
  family_id: string | null;
}

const CategoryManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [familyId, setFamilyId] = useState<string | null>(null);
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [selectedIcon, setSelectedIcon] = useState('DollarSign');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get user's family
      const { data: memberData } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (memberData) {
        setFamilyId(memberData.family_id);
      }

      // Get categories
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(categoriesData || []);

    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar categorias',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCategory = async () => {
    if (!name.trim() || !familyId) return;

    try {
      if (editingCategory) {
        // Update existing
        await supabase
          .from('categories')
          .update({
            name: name.trim(),
            type,
            icon: selectedIcon,
            color: selectedColor,
          })
          .eq('id', editingCategory.id);

        toast({ title: 'Sucesso', description: 'Categoria atualizada!' });
      } else {
        // Create new
        await supabase
          .from('categories')
          .insert({
            name: name.trim(),
            type,
            icon: selectedIcon,
            color: selectedColor,
            family_id: familyId,
            is_default: false,
          });

        toast({ title: 'Sucesso', description: 'Categoria criada!' });
      }

      resetDialog();
      fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar categoria',
        variant: 'destructive',
      });
    }
  };

  const deleteCategory = async (category: Category) => {
    try {
      await supabase.from('categories').delete().eq('id', category.id);
      toast({ title: 'Sucesso', description: 'Categoria excluída!' });
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir categoria',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setType(category.type as 'income' | 'expense');
    setSelectedIcon(category.icon);
    setSelectedColor(category.color);
    setIsDialogOpen(true);
  };

  const resetDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setName('');
    setType('expense');
    setSelectedIcon('DollarSign');
    setSelectedColor('#3B82F6');
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(i => i.value === iconName);
    return iconOption ? iconOption.icon : DollarSign;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-5 w-5" />
          Gestão de Categorias
        </CardTitle>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetDialog(); else setIsDialogOpen(true); }}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={!familyId}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Ex: Alimentação"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={type} onValueChange={(v) => setType(v as 'income' | 'expense')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Despesa</SelectItem>
                    <SelectItem value="income">Receita</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ícone</Label>
                <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedIcon(option.value)}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedIcon === option.value 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                        }`}
                        title={option.label}
                      >
                        <IconComponent className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-primary' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 border rounded-lg bg-muted/50">
                <Label className="text-xs text-muted-foreground">Prévia</Label>
                <div className="flex items-center gap-3 mt-2">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedColor }}
                  >
                    {(() => {
                      const IconComponent = getIconComponent(selectedIcon);
                      return <IconComponent className="h-5 w-5" />;
                    })()}
                  </div>
                  <div>
                    <p className="font-medium">{name || 'Nome da categoria'}</p>
                    <Badge variant={type === 'income' ? 'success' : 'secondary'}>
                      {type === 'income' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetDialog}>Cancelar</Button>
              <Button onClick={saveCategory} disabled={!name.trim()}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!familyId && (
          <div className="text-center py-4 text-muted-foreground">
            Crie uma família nas configurações para gerenciar categorias personalizadas.
          </div>
        )}

        {/* Expense Categories */}
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">
            Despesas ({expenseCategories.length})
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {expenseCategories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <div 
                  key={category.id} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{category.name}</span>
                    {category.is_default && (
                      <Badge variant="outline" className="text-xs">Padrão</Badge>
                    )}
                  </div>
                  
                  {!category.is_default && category.family_id && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Transações associadas não serão excluídas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteCategory(category)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Income Categories */}
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">
            Receitas ({incomeCategories.length})
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {incomeCategories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <div 
                  key={category.id} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{category.name}</span>
                    {category.is_default && (
                      <Badge variant="outline" className="text-xs">Padrão</Badge>
                    )}
                  </div>
                  
                  {!category.is_default && category.family_id && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Transações associadas não serão excluídas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteCategory(category)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;
