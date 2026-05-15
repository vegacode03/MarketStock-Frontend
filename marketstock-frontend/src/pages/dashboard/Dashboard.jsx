import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { reportApi, saleApi } from '../../api/sale';
import { productApi } from '../../api/product';
import { Card, PageHeader, Skeleton, EmptyState } from '../../components/ui/index';
import { Package, DollarSign, ShoppingCart, AlertTriangle } from 'lucide-react';
import { formatBRL, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [summary, setSummary] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const results = await Promise.allSettled([
          productApi.list(),
          reportApi.topProducts(5),
          reportApi.lowStock(10),
          reportApi.summary('month')
        ]);

        if (results[0].status === 'fulfilled') {
          const data = results[0].value.data;
          // Ajustado para encontrar a chave 'Produtos' vinda do seu backend
          setProducts(Array.isArray(data) ? data : (data?.Produtos || data?.products || []));
        }
        
        if (results[1].status === 'fulfilled') {
          const data = results[1].value.data;
          setTopProducts(Array.isArray(data) ? data : []);
        }

        if (results[2].status === 'fulfilled') {
          const data = results[2].value.data;
          setLowStock(Array.isArray(data) ? data : []);
        }

        if (results[3].status === 'fulfilled') {
          setSummary(results[3].value.data || null);
        }

      } catch (error) {
        addToast('Erro ao carregar dados do dashboard', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [addToast]);

  // Variável segura para evitar erros de .filter()
  const safeProducts = Array.isArray(products) ? products : [];
  
  const totalStock = safeProducts
    .filter(p => p?.status === 'ATIVO')
    .reduce((acc, p) => acc + (p?.quantity || p?.quantidade || 0), 0);

  const totalRevenue = summary?.total_revenue || 0;
  const totalSales = summary?.total_items_sold || 0;
  const lowStockCount = lowStock.length;

  const chartData = summary?.daily_sales || [
    { date: 'Vendas Totais', total: totalRevenue }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-60" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Visão geral do seu negócio" />

      {/* Grid Indicadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-brand-50 border-brand-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Produtos em Estoque</p>
              <h3 className="text-2xl font-display font-bold mt-1">{totalStock}</h3>
            </div>
            <Package size={20} className="text-brand-600" />
          </div>
        </Card>

        <Card className="p-4 bg-brand-50 border-brand-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Valor Total Vendido</p>
              <h3 className="text-2xl font-display font-bold mt-1 text-sm lg:text-2xl">{formatBRL(totalRevenue)}</h3>
            </div>
            <DollarSign size={20} className="text-brand-600" />
          </div>
        </Card>

        <Card className="p-4 bg-white border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Total de Itens Vendidos</p>
              <h3 className="text-2xl font-display font-bold mt-1">{totalSales}</h3>
            </div>
            <ShoppingCart size={20} className="text-gray-400" />
          </div>
        </Card>

        <Card className="p-4 bg-white border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Estoque Baixo</p>
              <h3 className="text-2xl font-display font-bold mt-1">{lowStockCount}</h3>
            </div>
            <AlertTriangle size={20} className={lowStockCount > 0 ? 'text-amber-500' : 'text-gray-400'} />
          </div>
        </Card>
      </div>

      {/* Gráfico de Vendas */}
      <Card className="p-5">
        <h4 className="font-display font-semibold text-gray-700 mb-6">Vendas — Resumo</h4>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#9ca3af'}}
              />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <Tooltip 
                cursor={{fill: '#f9fafb'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(val) => [formatBRL(val), 'Vendido']}
              />
              <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Grid Inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos Mais Vendidos */}
        <Card className="p-5">
          <h4 className="font-display font-semibold text-gray-700 mb-4">Produtos Mais Vendidos</h4>
          {topProducts.length === 0 ? (
            <EmptyState icon="💸" title="Nenhuma venda" description="As estatísticas de vendas aparecerão aqui." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-50">
                    <th className="pb-3 font-medium">Produto</th>
                    <th className="pb-3 font-medium text-right">Qtd Vendida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topProducts.map((item) => (
                    <tr key={item.product_id}>
                      <td className="py-3 font-medium text-gray-700">{item.name}</td>
                      <td className="py-3 text-right font-semibold text-brand-600">
                        {item.total_sold} un
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Estoque Baixo */}
        <Card className="p-5">
          <h4 className="font-display font-semibold text-gray-700 mb-4">Estoque Baixo</h4>
          {lowStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-3">✅</span>
              <p className="text-brand-600 font-medium">Tudo certo com seu estoque!</p>
              <p className="text-xs text-gray-400 mt-1">Nenhum produto abaixo do limite.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lowStock.map((prod) => (
                <div key={prod.product_id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">{prod.name}</span>
                  <span className="px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-full">
                    {prod.current_quantity} un
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}