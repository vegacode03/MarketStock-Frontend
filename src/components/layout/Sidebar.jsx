import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  User, 
  LogOut, 
  Store 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ open, onClose }) {
  const { seller, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Produtos', path: '/produtos', icon: Package },
    { label: 'Realizar Venda', path: '/venda', icon: ShoppingCart },
    { label: 'Histórico', path: '/vendas', icon: ClipboardList },
    { label: 'Perfil', path: '/perfil', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 z-20 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-brand-900 flex flex-col z-30 transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        {/* Logo */}
        <div className="px-5 py-6 border-b border-brand-800">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500 rounded-lg p-2 text-white">
              <Store size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="text-white text-sm font-display font-semibold">MarketStock</h2>
              <p className="text-brand-400 text-xs truncate">{seller?.nome || 'Vendedor'}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${isActive 
                  ? 'bg-brand-600 text-white font-medium' 
                  : 'text-brand-300 hover:bg-brand-800 hover:text-white'}
              `}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-brand-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-brand-300 hover:text-red-400 transition-all"
          >
            <LogOut size={18} />
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}