import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../api/product';
import { 
  Card, 
  Button, 
  Badge, 
  Input, 
  Select, 
  PageHeader, 
  EmptyState, 
  Skeleton, 
  Modal 
} from '../../components/ui/index';
import { Eye, Pencil, XCircle, Plus, Package } from 'lucide-react';
import { formatBRL } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function ProductList() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmModal, setConfirmModal] = useState({ open: false, productId: null });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await productApi.list();
      const data = response.data;
      // Ajustado para encontrar a chave 'Produtos' vinda do seu backend
      setProducts(Array.isArray(data) ? data : (data?.Produtos || data?.products || []));
    } catch (error) {
      addToast('Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Variável segura para evitar erros de .filter()
  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts
    .filter(p => {
      const name = p?.nome || p?.name || '';
      return name.toLowerCase().includes(search.toLowerCase());
    })
    .filter(p => statusFilter === 'all' || p?.status === statusFilter);

  const handleInactivate = async () => {
    try {
      await productApi.inactivate(confirmModal.productId);
      setProducts(products.map(p => 
        p.id === confirmModal.productId ? { ...p, status: 'INATIVO' } : p
      ));
      addToast('Produto inativado com sucesso', 'success');
    } catch (error) {
      addToast('Erro ao inativar produto', 'error');
    } finally {
      setConfirmModal({ open: false, productId: null });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Produtos" 
        subtitle={`${products.length} produto(s) cadastrado(s)`}
        action={
          <Button onClick={() => navigate('/produtos/novo')}>
            <Plus size={18} />
            Novo Produto
          </Button>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <Input 
            label="Buscar produto"
            placeholder="Nome do produto..."
            className="flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select 
            label="Status"
            className="w-full md:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos os status</option>
            <option value="ATIVO">Ativos</option>
            <option value="INATIVO">Inativos</option>
          </Select>
          <div className="bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 text-sm font-medium text-gray-500">
            {filteredProducts.length} filtrado(s)
          </div>
        </div>
      </Card>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : filteredProducts.length === 0 ? (
        <EmptyState 
          icon="📦" 
          title="Nenhum produto encontrado" 
          description="Tente ajustar seus filtros ou cadastre um novo produto."
          action={
            search && (
              <Button variant="secondary" onClick={() => setSearch('')}>
                Limpar busca
              </Button>
            )
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4">Estoque</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const productName = product?.nome || product?.name || 'Sem nome';
                  const productPrice = product?.preco || product?.price || 0;
                  const productQuantity = product?.quantidade || product?.quantity || 0;
                  const productImage = product?.imagem || product?.image;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {productImage ? (
                              <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={20} className="text-gray-400" />
                            )}
                          </div>
                          <span className="font-medium text-gray-700">{productName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatBRL(productPrice)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 font-medium">{productQuantity}</span>
                          {productQuantity <= 5 && (
                            <Badge variant="danger">Baixo</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={product.status === 'ATIVO' ? 'success' : 'inactive'}>
                          {product.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/produtos/${product.id}`)}
                            title="Ver detalhes"
                          >
                            <Eye size={18} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/produtos/${product.id}/editar`)}
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </Button>
                          {product.status === 'ATIVO' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:bg-red-50"
                              onClick={() => setConfirmModal({ open: true, productId: product.id })}
                              title="Inativar"
                            >
                              <XCircle size={18} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, productId: null })}
        title="Inativar produto?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Tem certeza que deseja inativar este produto? Ele não poderá ser utilizado em novas vendas, mas continuará aparecendo em relatórios antigos.
          </p>
          <div className="flex gap-3 justify-end">
            <Button 
              variant="secondary" 
              onClick={() => setConfirmModal({ open: false, productId: null })}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleInactivate}>
              Inativar Produto
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}