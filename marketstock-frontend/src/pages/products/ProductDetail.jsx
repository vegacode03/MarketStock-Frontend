import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../../api/product';
import { formatBRL } from '../../utils/formatters';
import { Card, Button, Badge, Skeleton, Modal, PageHeader } from '../../components/ui/index';
import { ArrowLeft, Pencil, XCircle, Package } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    productApi.show(id)
      .then(res => {
        // Mapeia os dados do backend (Produto wrapper)
        const p = res.data?.Produto;
        if (p) {
          setProduct({
            id: p.id,
            nome: p.name || p.nome,
            preco: p.price || p.preco,
            quantidade: p.quantity || p.quantidade,
            imagem: p.image || p.imagem,
            status: p.status
          });
        } else {
          throw new Error('Produto não encontrado');
        }
      })
      .catch(() => {
        addToast('Erro ao carregar produto', 'error');
        navigate('/produtos');
      })
      .finally(() => setLoading(false));
  }, [id, navigate, addToast]);

  const handleInactivate = async () => {
    try {
      await productApi.inactivate(id);
      addToast('Produto inativado com sucesso!', 'success');
      navigate('/produtos');
    } catch (e) {
      addToast('Erro ao inativar produto', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Detalhes do Produto" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Detalhes do Produto" 
        action={
          <Button variant="secondary" onClick={() => navigate('/produtos')}>
            <ArrowLeft size={18} />
            Voltar
          </Button>
        }
      />

      <div className="lg:flex gap-8 mt-6">
        {/* Esquerdo - Imagem */}
        <div className="lg:w-64 flex-shrink-0 mb-6 lg:mb-0">
          {product.imagem ? (
            <img 
              src={product.imagem} 
              alt={product.nome} 
              className="w-full aspect-square rounded-2xl object-cover border border-gray-100 shadow-sm"
            />
          ) : (
            <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center border border-dashed border-gray-200">
              <Package size={48} className="text-gray-300" />
            </div>
          )}
        </div>

        {/* Direito - Informações */}
        <div className="flex-1">
          <Card className="p-6 lg:p-8">
            <h2 className="text-2xl font-display font-semibold text-gray-800">
              {product.nome}
            </h2>
            
            <div className="mt-2">
              <Badge variant={product.status === 'ATIVO' ? 'success' : 'inactive'}>
                {product.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>

            <div className="mt-6">
              <p className="text-3xl font-bold text-brand-600">
                {formatBRL(product.preco)}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-600">
                  Estoque: <span className="font-semibold text-gray-900">{product.quantidade}</span> unidades
                </span>
                {product.quantidade <= 10 && (
                  <Badge variant="danger">Baixo Estoque</Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Button 
                variant="primary" 
                onClick={() => navigate(`/produtos/${id}/editar`)}
              >
                <Pencil size={18} />
                Editar Produto
              </Button>
              
              {product.status === 'ATIVO' && (
                <Button 
                  variant="danger" 
                  onClick={() => setConfirmModal(true)}
                >
                  <XCircle size={18} />
                  Inativar Produto
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirmar Inativação"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Tem certeza que deseja inativar o produto <strong>{product.nome}</strong>? 
            Ele não poderá ser selecionado em novas vendas.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setConfirmModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleInactivate}>
              Confirmar e Inativar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
