import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../../api/product';
import { Input, Select, Button, Card, PageHeader, Skeleton } from '../../components/ui/index';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Package, X } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  price: z.coerce.number({ invalid_type_error: 'Preço inválido' }).positive('Deve ser positivo'),
  quantity: z.coerce.number({ invalid_type_error: 'Quantidade inválida' }).int().min(0),
  image: z.any().optional(),
  status: z.string().default('ATIVO')
});

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [imagePreview, setImagePreview] = useState('');
  const [loadingProduct, setLoadingProduct] = useState(true);

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      quantity: 0,
      status: 'ATIVO',
      image: ''
    }
  });

  useEffect(() => {
    productApi.show(id)
      .then(res => {
        // Pega do wrapper "Produto" conforme seu Controller
        const p = res.data?.Produto;
        
        if (p) {
          const loadedData = {
            name: p.name || p.nome || '',
            price: p.price || p.preco || 0,
            quantity: p.quantity || p.quantidade || 0,
            status: p.status || 'ATIVO',
            image: p.image || p.imagem || ''
          };
          
          reset(loadedData);
          setImagePreview(loadedData.image);
        } else {
          throw new Error('Produto não encontrado');
        }
      })
      .catch((err) => { 
        console.error(err);
        addToast('Erro ao carregar dados do produto', 'error'); 
        navigate('/produtos'); 
      })
      .finally(() => setLoadingProduct(false));
  }, [id, reset, addToast, navigate]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('nome', data.name);
      formData.append('preco', data.price);
      formData.append('quantidade', data.quantity);
      formData.append('status', data.status);
      
      // Só envia o campo 'imagem' se houver um novo arquivo selecionado
      // data.image será um FileList se o usuário clicou no input
      if (data.image && data.image[0] instanceof File) {
        formData.append('imagem', data.image[0]);
      }

      await productApi.update(id, formData);
      addToast('Produto atualizado!', 'success');
      navigate('/produtos');
    } catch (e) {
      addToast(e.response?.data?.message || 'Erro ao atualizar', 'error');
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
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Editar Produto" 
        action={
          <Button variant="secondary" onClick={() => navigate('/produtos')}>
            <ArrowLeft size={18} />
            Voltar
          </Button>
        }
      />

      <Card className="max-w-xl mx-auto p-6">
        {loadingProduct ? (
          <Skeleton className="h-96 w-full" />
        ) : (
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
                          setValue('image', '');
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
                Salvar Alterações
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
