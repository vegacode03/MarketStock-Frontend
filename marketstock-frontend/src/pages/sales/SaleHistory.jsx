import React, { useState, useEffect, useMemo } from 'react';
import { saleApi } from '../../api/sale';
import { Card, PageHeader, Skeleton, EmptyState } from '../../components/ui/index';
import { ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { formatBRL, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function SaleHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function fetchSales() {
      try {
        const response = await saleApi.list();
        if (isMounted) {
          const data = response.data;
          setSales(Array.isArray(data) ? data : (data?.Vendas || data?.sales || []));
        }
      } catch (error) {
        if (isMounted) {
          addToast('Erro ao carregar histórico de vendas', 'error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchSales();
    return () => { isMounted = false; };
  }, [addToast]);

  const filteredSales = useMemo(() => {
    const now = new Date();
    return sales.filter(sale => {
      const saleDate = new Date(sale.date || sale.data || sale.created_at);
      
      if (period === 'today') {
        return saleDate.toDateString() === now.toDateString();
      }
      
      const diffTime = Math.abs(now - saleDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (period === 'week') {
        return diffDays <= 7;
      }
      
      if (period === 'month') {
        return diffDays <= 30;
      }
      
      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.date || a.data || a.created_at);
      const dateB = new Date(b.date || b.data || b.created_at);
      return dateB - dateA;
    });
  }, [sales, period]);

  const metrics = useMemo(() => {
    const totalCount = filteredSales.length;
    const totalRevenue = filteredSales.reduce((acc, sale) => acc + (sale.total || (sale.price * sale.quantity) || 0), 0);
    
    // Calcular produto mais vendido (mais frequente)
    const frequency = {};
    filteredSales.forEach(sale => {
      const name = sale.product_name || sale.produto_nome || sale.name || sale.nome || '-';
      frequency[name] = (frequency[name] || 0) + (sale.quantity || sale.quantidade || 0);
    });
    
    let top = '-';
    let max = 0;
    Object.entries(frequency).forEach(([name, qty]) => {
      if (qty > max) {
        max = qty;
        top = name;
      }
    });

    return { totalCount, totalRevenue, topProduct: top };
  }, [filteredSales]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Histórico de Vendas" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const periodButtons = [
    { id: 'today', label: 'Hoje' },
    { id: 'week', label: '7 dias' },
    { id: 'month', label: '30 dias' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Histórico de Vendas" 
        subtitle="Visualize e filtre suas vendas realizadas"
      />

      {/* Filtros de Período */}
      <div className="flex gap-2">
        {periodButtons.map(btn => (
          <button
            key={btn.id}
            onClick={() => setPeriod(btn.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              period === btn.id 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Vendas no Período</p>
            <h3 className="text-2xl font-bold text-gray-900">{metrics.totalCount}</h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Receita do Período</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatBRL(metrics.totalRevenue)}</h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Produto Mais Vendido</p>
            <h3 className="text-xl font-bold text-gray-900 truncate max-w-[150px]" title={metrics.topProduct}>
              {metrics.topProduct}
            </h3>
          </div>
        </Card>
      </div>

      {/* Listagem de Vendas */}
      <Card className="overflow-hidden">
        {filteredSales.length === 0 ? (
          <EmptyState 
            icon="📋" 
            title="Nenhuma venda encontrada" 
            description="Não há registros de vendas para o período selecionado."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Qtd</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preço Unit.</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSales.map((sale, index) => {
                  const unitPrice = sale.price || sale.preco || 0;
                  const qty = sale.quantity || sale.quantidade || 0;
                  const total = sale.total || (unitPrice * qty);
                  
                  return (
                    <tr key={sale.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {sale.product_name || sale.produto_nome || sale.name || sale.nome}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(sale.date || sale.data || sale.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {qty}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatBRL(unitPrice)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-brand-700">
                          {formatBRL(total)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
