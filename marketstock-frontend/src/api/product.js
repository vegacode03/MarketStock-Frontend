import api from './axios';

export const productApi = {
  list() {
    return api.get('/api/products');
  },
  show(id) {
    return api.get(`/api/products/${id}`);
  },
  create(data) {
    // Agora aceita FormData para upload de imagem
    return api.post('/api/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
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