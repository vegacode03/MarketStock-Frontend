import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input, Button } from '../../components/ui/index';
import { Store, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha')
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (e) {
      if (e.response?.status === 403) {
        addToast('Conta não ativada. Verifique seu WhatsApp.', 'warning');
      } else {
        addToast('E-mail ou senha incorretos.', 'error');
      }
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
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[400px]">
          <h2 className="font-display text-2xl font-semibold text-gray-800">Boas-vindas de volta</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">Entre com suas credenciais para acessar o painel.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input 
              label="E-mail" 
              type="email" 
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

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
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Entrar
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-brand-600 font-semibold hover:underline transition-all">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}