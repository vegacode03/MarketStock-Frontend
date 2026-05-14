import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { sellerApi } from '../../api/seller';
import { useToast } from '../../context/ToastContext';
import { Input, Button } from '../../components/ui/index';
import { Store, Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  email: z.string().email('E-mail inválido'),
  cellphone: z.string().min(10, 'Celular inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string()
}).refine(d => d.password === d.confirmPassword, { 
  message: 'Senhas não coincidem', 
  path: ['confirmPassword'] 
});

export default function Register() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      await sellerApi.register(data);
      sessionStorage.setItem('ms_pending_phone', data.cellphone);
      navigate('/ativar');
    } catch (e) {
      addToast(e.response?.data?.message || 'Erro ao criar conta', 'error');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Painel Esquerdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 flex-col items-center justify-center p-12 text-center">
        <Store size={56} className="text-white" />
        <h1 className="text-4xl font-display font-bold text-white mt-6">MarketStock</h1>
        <p className="text-brand-300 text-lg mt-3">Controle seu estoque. Aumente suas vendas.</p>
      </div>

      {/* Painel Direito */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto bg-white">
        <div className="w-full max-w-[400px]">
          <h2 className="font-display text-2xl font-semibold">Criar conta</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">Comece a gerenciar seu negócio hoje.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input 
              label="Nome do mercado" 
              placeholder="Ex: Mercadinho do João" 
              error={errors.name?.message}
              {...register('name')}
            />
            <Input 
              label="CNPJ" 
              placeholder="00.000.000/0001-00" 
              error={errors.cnpj?.message}
              {...register('cnpj')}
            />
            <Input 
              label="E-mail" 
              type="email" 
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div>
              <Input 
                label="Celular" 
                placeholder="+55 (11) 99999-9999" 
                error={errors.cellphone?.message}
                {...register('cellphone')}
              />
              <p className="text-[10px] text-gray-400 mt-1">Você receberá um código de ativação via WhatsApp</p>
            </div>

            <div className="relative">
              <Input 
                label="Senha" 
                type={showPassword ? 'text' : 'password'} 
                error={errors.password?.message}
                {...register('password')}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Input 
                label="Confirmar Senha" 
                type={showConfirmPassword ? 'text' : 'password'} 
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Criar conta
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}