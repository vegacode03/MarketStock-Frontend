import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { sellerApi } from '../../api/seller';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input, Button, Card, PageHeader, Modal, Badge } from '../../components/ui/index';
import { Lock, LogOut } from 'lucide-react';
import { formatCNPJ } from '../../utils/formatters';

const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  cellphone: z.string().min(10, 'Celular inválido')
});

export default function Profile() {
  const { seller, updateSeller, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [passwordModal, setPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: seller?.nome || seller?.name || '',
      email: seller?.email || '',
      cellphone: seller?.celular || seller?.cellphone || ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await sellerApi.update(data);
      updateSeller(response.data?.Vendedor || response.data?.seller || response.data);
      addToast('Perfil atualizado com sucesso!', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Erro ao atualizar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = (seller?.nome || seller?.name || '?').charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Meu Perfil" 
        subtitle="Gerencie as informações da sua conta e mercado"
      />

      <Card className="max-w-xl mx-auto overflow-hidden">
        {/* Seção Avatar */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
          <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
            {initial}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{seller?.nome || seller?.name}</h3>
            <p className="text-sm text-gray-500">{seller?.email}</p>
            <div className="mt-1">
              <Badge variant="success">Conta Ativa</Badge>
            </div>
          </div>
        </div>

        {/* Seção Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Informações do mercado
          </p>
          
          <Input
            label="Nome do Mercado"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="E-mail"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Celular"
            {...register('cellphone')}
            error={errors.cellphone?.message}
          />

          <div className="space-y-1">
            <Input
              label="CNPJ"
              disabled
              value={formatCNPJ(seller?.cnpj || '')}
            />
            <p className="text-[10px] text-gray-400 ml-1">
              O CNPJ não pode ser alterado por questões de segurança.
            </p>
          </div>

          <div className="flex gap-3 justify-end mt-8">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => reset()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              loading={loading}
            >
              Salvar Alterações
            </Button>
          </div>
        </form>

        {/* Seção Segurança */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={() => setPasswordModal(true)}
          >
            <Lock size={18} className="mr-2" />
            Alterar Senha
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Sair da Conta
          </Button>
        </div>
      </Card>

      {/* Modal Senha */}
      <Modal
        open={passwordModal}
        onClose={() => setPasswordModal(false)}
        title="Alterar Senha"
      >
        <div className="space-y-4 py-4">
          <Input label="Senha Atual" type="password" disabled placeholder="********" />
          <Input label="Nova Senha" type="password" disabled placeholder="********" />
          <Input label="Confirmar Nova Senha" type="password" disabled placeholder="********" />
          
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
            <p className="text-sm text-amber-800 font-medium text-center">
              Funcionalidade em breve!
            </p>
            <p className="text-xs text-amber-600 text-center mt-1">
              A alteração de senha está sendo implementada.
            </p>
          </div>

          <Button 
            variant="primary" 
            className="w-full" 
            onClick={() => setPasswordModal(false)}
          >
            Fechar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
