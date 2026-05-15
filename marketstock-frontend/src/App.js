import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import PrivateRoute from './components/layout/PrivateRoute';

// Páginas Reais
import Register from './pages/auth/Register';
import Activate from './pages/auth/Activate';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ProductList from './pages/products/ProductList';
import ProductCreate from './pages/products/ProductCreate';
import ProductEdit from './pages/products/ProductEdit';
import ProductDetail from './pages/products/ProductDetail';

// Placeholders temporários remanescentes
const NewSale = () => <div style={{padding:'2rem',fontFamily:'sans-serif'}}>NewSale — em desenvolvimento</div>;
const SaleHistory = () => <div style={{padding:'2rem',fontFamily:'sans-serif'}}>SaleHistory — em desenvolvimento</div>;
const Profile = () => <div style={{padding:'2rem',fontFamily:'sans-serif'}}>Profile — em desenvolvimento</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/ativar" element={<Activate />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produtos" element={<ProductList />} />
        <Route path="/produtos/novo" element={<ProductCreate />} />
        <Route path="/produtos/:id" element={<ProductDetail />} />
        <Route path="/produtos/:id/editar" element={<ProductEdit />} />
        <Route path="/venda" element={<NewSale />} />
        <Route path="/vendas" element={<SaleHistory />} />
        <Route path="/perfil" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;