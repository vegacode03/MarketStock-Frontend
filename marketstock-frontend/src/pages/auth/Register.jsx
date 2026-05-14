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
  name: z.string().min(3, 'Nome: mínimo 3 caracteres'),
  cnpj: z.string().min(14, 'CNPJ: mínimo 14 números'),
  email: z.string().email('E-mail: formato inválido (ex: joao@email.com)'),
  cellphone: z.string().min(10, 'Celular: mínimo 10 números com DDD'),
  password: z.string().min(6, 'Senha: mínimo 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirme sua senha')
}).refine(d => d.password === d.confirmPassword, { 
  message: 'As senhas não coincidem', 
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

  // Função para ver erros de validação no console (F12)
  const onError = (errors) => {
    console.log('Erros de validação encontrados:', errors);
  };

  const onSubmit = async (data) => {
    console.log('Tentando enviar dados para o backend:', data);
    try {
      const response = await sellerApi.register(data);
      console.log('Resposta do backend com sucesso:', response.data);
      sessionStorage.setItem('ms_pending_phone', data.cellphone);
      navigate('/ativar');
    } catch (e) {
      console.error('Erro na requisição ao backend:', e.response?.data || e.message);
      addToast(e.response?.data?.message || 'Erro ao conectar com o servidor', 'error');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 flex-col items-center justify-center p-12 text-center">
        <Store size={56} className="text-white" />
        <h1 className="text-4xl font-display font-bold text-white mt-6">MarketStock</h1>
        <p className="text-brand-300 text-lg mt-3">Controle seu estoque. Aumente suas vendas.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto bg-white">
        <div className="w-full max-w-[400px]">
          <h2 className="font-display text-2xl font-semibold">Criar conta</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">Preencha todos os campos corretamente.</p>

          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
            <Input 
              label="Nome do mercado" 
              placeholder="Mínimo 3 letras" 
              error={errors.name?.message}
              {...register('name')}
            />
            <Input 
              label="CNPJ" 
              placeholder="Digite apenas os 14 números" 
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
                placeholder="Ex: 11999998888" 
                error={errors.cellphone?.message}
                {...register('cellphone')}
              />
              <p className="text-[10px] text-gray-400 mt-1">Apenas números com DDD</p>
            </div>

            <div className="relative">
              <Input 
                label="Senha" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Mínimo 6 caracteres"
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
                placeholder="Repita a senha"
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
            Já tem conta? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}