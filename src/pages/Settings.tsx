import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Settings as SettingsIcon, Users, UserPlus, Trash2, Shield, User } from 'lucide-react';
import CategoryManagement from '@/components/Dashboard/CategoryManagement';

interface Family {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface FamilyMember {
  id: string;
  role: string;
  joined_at: string;
  profiles: {
    full_name: string;
  } | null;
}

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [families, setFamilies] = useState<Family[]>([]);
  const [familyMembers, setFamilyMembers] = useState<{ [key: string]: FamilyMember[] }>({});
  const [newFamilyName, setNewFamilyName] = useState('');
  const [isCreatingFamily, setIsCreatingFamily] = useState(false);

  useEffect(() => {
    fetchUserFamilies();
  }, [user]);

  const fetchUserFamilies = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get families where user is a member
      const { data: membershipData } = await supabase
        .from('family_members')
        .select(`
          family_id,
          role,
          families (id, name, description, created_at)
        `)
        .eq('user_id', user.id);

      if (membershipData) {
        const familiesData = membershipData
          .filter(m => m.families)
          .map(m => m.families as Family);
        
        setFamilies(familiesData);

        // Get members for each family
        for (const family of familiesData) {
          const { data: membersData } = await supabase
            .from('family_members')
            .select(`
              id,
              role,
              joined_at
            `)
            .eq('family_id', family.id);

          // Get profiles separately to avoid relation issues
          const membersWithProfiles = [];
          if (membersData) {
            for (const member of membersData) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('user_id', (member as any).user_id)
                .single();
              
              membersWithProfiles.push({
                ...member,
                profiles: profile || { full_name: 'Usuário sem nome' }
              });
            }
          }

          setFamilyMembers(prev => ({
            ...prev,
            [family.id]: membersWithProfiles as FamilyMember[]
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching families:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar famílias',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createFamily = async () => {
    if (!newFamilyName.trim() || !user) return;

    setIsCreatingFamily(true);
    
    try {
      // Create family
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .insert({
          name: newFamilyName,
          description: `Família criada por ${user.email}`,
          created_by: user.id
        })
        .select()
        .single();

      if (familyError) throw familyError;

      // Add creator as admin
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: familyData.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      toast({
        title: 'Sucesso',
        description: 'Família criada com sucesso!',
      });

      setNewFamilyName('');
      fetchUserFamilies();
    } catch (error) {
      console.error('Error creating family:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar família',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingFamily(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getRoleName = (role: string) => {
    return role === 'admin' ? 'Administrador' : 'Membro';
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas famílias e configurações da conta
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={user?.email || ''} disabled />
          </div>
          <div>
            <Label>Data de Cadastro</Label>
            <Input 
              value={user?.created_at ? formatDate(user.created_at) : ''} 
              disabled 
            />
          </div>
        </CardContent>
      </Card>

      {/* Create New Family */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Criar Nova Família
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nome da família"
              value={newFamilyName}
              onChange={(e) => setNewFamilyName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createFamily()}
            />
            <Button 
              onClick={createFamily}
              disabled={isCreatingFamily || !newFamilyName.trim()}
            >
              {isCreatingFamily ? 'Criando...' : 'Criar'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Você será automaticamente adicionado como administrador da nova família.
          </p>
        </CardContent>
      </Card>

      {/* Families List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Minhas Famílias ({families.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {families.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Você ainda não faz parte de nenhuma família.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Crie uma nova família para começar a gerenciar suas finanças.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {families.map((family) => (
                <Card key={family.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{family.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {family.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criada em {formatDate(family.created_at)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <SettingsIcon className="h-4 w-4 mr-1" />
                        Gerenciar
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Membros ({familyMembers[family.id]?.length || 0})
                      </h4>
                      
                      <div className="space-y-2">
                        {familyMembers[family.id]?.map((member) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {member.profiles?.full_name || 'Usuário sem nome'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Membro desde {formatDate(member.joined_at)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge className={getRoleColor(member.role)}>
                                {getRoleName(member.role)}
                              </Badge>
                              {member.role !== 'admin' && (
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )) || []}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Management */}
      <CategoryManagement />
    </div>
  );
};

export default Settings;