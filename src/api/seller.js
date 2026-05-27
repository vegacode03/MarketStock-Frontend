import api from './axios';

export const sellerApi = {
  register(data) {
    return api.post('/api/sellers', {
      nome: data.name,
      cnpj: data.cnpj,
      email: data.email,
      senha: data.password,
      celular: data.cellphone
    });
  },
  activate(cellphone, code) {
    return api.post('/api/sellers/activate', {
      celular: cellphone,
      codigo: code
    });
  },
  login(email, password) {
    return api.post('/api/sellers/login', {
      email,
      senha: password
    });
  },
  update(data) {
    return api.put('/api/sellers/me', {
      nome: data.name,
      email: data.email,
      celular: data.cellphone
    });
  }
};