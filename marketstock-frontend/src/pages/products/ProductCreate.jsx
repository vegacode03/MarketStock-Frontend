import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../api/product';
import { Input, Select, Button, Card, PageHeader } from '../../components/ui/index';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  price: z.coerce.number({ invalid_type_error: 'Preço inválido' }).positive('Deve ser positivo'),
  quantity: z.coerce.number({ invalid_type_error: 'Quantidade inválida' }).int().min(0),
  image: z.string().url('URL inválida').optional().or(z.literal('')),
  status: z.string().default('ATIVO')
});

export default function ProductCreate() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [imagePreview, setImagePreview] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: 'ATIVO',
      image: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await productApi.create({
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        image: data.image || ''
      });
      addToast('Produto cadastrado!', 'success');
      navigate('/produtos');
    } catch (e) {
      addToast(e.response?.data?.message || 'Erro ao cadastrar', 'error');
    }
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setImagePreview(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Novo Produto" 
        action={
          <Button variant="secondary" onClick={() => navigate('/produtos')}>
            <ArrowLeft size={18} />
            Voltar
          </Button>
        }
      />

      <Card className="max-w-xl mx-auto p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input 
              label="URL da Imagem"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              error={errors.image?.message}
              {...register('image', { 
                onChange: handleImageChange 
              })}
            />
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 rounded-xl object-cover border"
                  onError={() => setImagePreview('')}
                />
              </div>
            )}
          </div>

          <Input 
            label="Nome do Produto"
            placeholder="Ex: Arroz 5kg"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Preço (R$)"
              type="number"
              step="0.01"
              placeholder="0,00"
              error={errors.price?.message}
              {...register('price')}
            />
            <Input 
              label="Quantidade"
              type="number"
              step="1"
              min="0"
              placeholder="0"
              error={errors.quantity?.message}
              {...register('quantity')}
            />
          </div>

          <Select 
            label="Status"
            error={errors.status?.message}
            {...register('status')}
          >
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </Select>

          <div className="flex gap-3 justify-end mt-6">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/produtos')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              loading={isSubmitting}
            >
              Cadastrar Produto
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}