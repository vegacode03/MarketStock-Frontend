import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../api/product';
import { saleApi } from '../../api/sale';
import { Card, Button, Select, PageHeader, Modal } from '../../components/ui/index';
import { ShoppingCart, Minus, Plus, CheckCircle, Package } from 'lucide-react';
import { formatBRL } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function NewSale() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState({ open: false, sale: null });

  useEffect(() => {
    productApi.list()
      .then(res => {
        const data = res.data;
        const allProducts = Array.isArray(data) ? data : (data?.Produtos || data?.products || []);
        // Filtra apenas produtos ativos e com estoque > 0
        setProducts(allProducts.filter(p => p.status === 'ATIVO'));
      })
      .catch(() => {
        addToast('Erro ao carregar produtos', 'error');
      });
  }, [addToast]);

  const selectedProduct = useMemo(() => {
    const p = products.find(p => String(p.id) === String(selectedProductId));
    if (!p) return null;
    return {
      id: p.id,
      nome: p.name || p.nome,
      preco: p.price || p.preco,
      quantidade: p.quantity || p.quantidade,
      imagem: p.image || p.imagem
    };
  }, [products, selectedProductId]);

  const total = useMemo(() => {
    return selectedProduct ? selectedProduct.preco * quantity : 0;
  }, [selectedProduct, quantity]);

  const resetForm = () => {
    setSelectedProductId('');
    setQuantity(1);
  };

  const handleConfirm = async () => {
    if (!selectedProduct) return;
    
    setLoading(true);
    try {
      const response = await saleApi.create(selectedProduct.id, quantity);
      addToast('Venda realizada!', 'success');
      setSuccessModal({ open: true, sale: response.data?.Venda || response.data });
      resetForm();
    } catch (e) {
      addToast(e.response?.data?.message || 'Erro ao realizar venda', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (val) => {
    const newVal = Math.max(1, Math.min(val, selectedProduct?.quantidade || 1));
    setQuantity(newVal);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Realizar Venda" 
        subtitle="Selecione um produto e a quantidade desejada"
      />

      <Card className="max-w-lg mx-auto p-6">
        <div className="space-y-6">
          <Select 
            label="Selecione o Produto"
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setQuantity(1);
            }}
          >
            <option value="">Escolha um produto...</option>
            {products.map(p => (
              <option key={p.id} value={p.id} disabled={p.quantidade === 0 || (p.quantity === 0)}>
                {p.name || p.nome} ({p.quantity || p.quantidade} em estoque)
              </option>
            ))}
          </Select>

          {selectedProduct && (
            <div className="animate-fade-in space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl flex gap-4">
                <div className="w-20 h-20 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selectedProduct.imagem ? (
                    <img src={selectedProduct.imagem} alt={selectedProduct.nome} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={24} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{selectedProduct.nome}</p>
                  <p className="text-brand-600 font-bold">{formatBRL(selectedProduct.preco)}</p>
                  <p className="text-xs text-gray-500 mt-1">Disponível: {selectedProduct.quantidade} unidades</p>
                </div>
              </div>

              {selectedProduct.quantidade > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Quantidade</label>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => updateQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </Button>
                    <input 
                      type="number"
                      className="w-20 text-center py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      value={quantity}
                      onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                      max={selectedProduct.quantidade}
                    />
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => updateQuantity(quantity + 1)}
                      disabled={quantity >= selectedProduct.quantidade}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-brand-50 p-4 rounded-xl flex justify-between items-center border border-brand-100">
                <span className="text-sm font-medium text-brand-800">Total da venda</span>
                <span className="text-xl font-bold text-brand-700">{formatBRL(total)}</span>
              </div>

              <Button 
                className="w-full mt-6" 
                size="lg"
                loading={loading}
                disabled={!selectedProduct || selectedProduct.quantidade === 0}
                onClick={handleConfirm}
              >
                <ShoppingCart size={20} />
                Confirmar Venda
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Modal
        open={successModal.open}
        onClose={() => setSuccessModal({ open: false, sale: null })}
        title="Venda Realizada!"
      >
        <div className="flex flex-col items-center text-center py-4 space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle size={40} />
          </div>
          
          <div>
            <p className="text-lg font-semibold text-gray-900">Sucesso!</p>
            <p className="text-sm text-gray-500">A venda foi processada e o estoque atualizado.</p>
          </div>

          <div className="w-full bg-gray-50 rounded-xl p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Pago:</span>
              <span className="font-bold text-gray-900">{formatBRL(total)}</span>
            </div>
          </div>

          <div className="flex flex-col w-full gap-2 mt-2">
            <Button 
              variant="primary" 
              onClick={() => {
                setSuccessModal({ open: false, sale: null });
                resetForm();
              }}
            >
              Nova Venda
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/vendas')}
            >
              Ver Histórico
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
