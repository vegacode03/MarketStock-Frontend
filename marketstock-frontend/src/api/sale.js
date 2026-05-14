import api from './axios';

export const saleApi = {
  create(productId, quantity) {
    return api.post('/api/sales', {
      produtoId: productId,
      quantidade: quantity
    });
  },
  list() {
    return api.get('/api/sales');
  }
};

export const reportApi = {
  summary(period = 'month') {
    return api.get(`/api/reports/sales-summary?period=${period}`);
  },
  topProducts(limit = 5) {
    return api.get(`/api/reports/top-selling-products?limit=${limit}`);
  },
  lowStock(threshold = 10) {
    return api.get(`/api/reports/low-stock-products?threshold=${threshold}`);
  }
};