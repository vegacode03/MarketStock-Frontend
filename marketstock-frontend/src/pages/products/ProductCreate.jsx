import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../api/product';
import { Input, Select, Button, Card, PageHeader } from '../../components/ui/index';
import { useToast } from '../../context/ToastContext';
import { Package, ArrowLeft, X } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  price: z.coerce.number({ invalid_type_error: 'Preço inválido' }).positive('Deve ser positivo'),
  quantity: z.coerce.number({ invalid_type_error: 'Quantidade inválida' }).int().min(0),
  image: z.any().optional(),
  status: z.string().default('ATIVO')
});

export default function ProductCreate() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [imagePreview, setImagePreview] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: 'ATIVO'
    }
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('nome', data.name);
      formData.append('preco', data.price);
      formData.append('quantidade', data.quantity);
      formData.append('status', data.status);
      
      if (data.image && data.image[0]) {
        formData.append('imagem', data.image[0]);
      }

      await productApi.create(formData);
      
      addToast('Produto cadastrado!', 'success');
      navigate('/produtos');
    } catch (e) {
      addToast(e.response?.data?.message || 'Erro ao cadastrar', 'error');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto do Produto
            </label>
            <div className="relative group">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 group-hover:bg-gray-50 transition-colors h-48 overflow-hidden">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImagePreview('');
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm z-10"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center pointer-events-none">
                    <Package size={48} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Clique para selecionar uma foto</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  {...register('image', { 
                    onChange: handleImageChange 
                  })}
                />
              </div>
            </div>
            {errors.image && (
              <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>
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