import api from './axios';

export const productApi = {
  list() {
    return api.get('/api/products');
  },
  show(id) {
    return api.get(`/api/products/${id}`);
  },
  create(data) {
    return api.post('/api/products', {
      nome: data.name,
      preco: data.price,
      quantidade: data.quantity,
      imagem: data.image
    });
  },
  update(id, data) {
    return api.put(`/api/products/${id}`, {
      nome: data.name,
      preco: data.price,
      quantidade: data.quantity,
      imagem: data.image
    });
  },
  inactivate(id) {
    return api.patch(`/api/products/${id}/inactivate`);
  }
};