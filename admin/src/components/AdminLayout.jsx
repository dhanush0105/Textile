import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Users,
  Percent,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Product Management', path: '/products', icon: Shirt },
    { name: 'Order Management', path: '/orders', icon: ShoppingBag },
    { name: 'Customer logs', path: '/customers', icon: Users },
    { name: 'Coupon Codes', path: '/coupons', icon: Percent },
    { name: 'Blog Authoring', path: '/blogs', icon: FileText },
    { name: 'Store Settings', path: '/settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Mobile Sidebar Trigger Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-earth text-cream-light transform lg:transform-none lg:static transition-transform duration-300 ease-in-out flex flex-col justify-between border-r border-gold/15 ${sidebarOpen ? 'translate-x-0' : '-translate-x-0 -translate-x-full lg:translate-x-0'}`}>
        
        {/* Sidebar Header */}
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-gold/10">
            <span className="font-serif text-lg font-bold tracking-widest uppercase">
              ANUSREE <span className="text-gold">TEX</span> <span className="text-[10px] text-gray-400 block tracking-normal normal-case">Control Panel</span>
            </span>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-cream hover:text-gold-light focus:outline-none">
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="mt-6 px-4 space-y-1.5 text-sm">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded transition-colors ${isActive ? 'bg-gold/15 text-gold font-semibold border-l-4 border-gold pl-3' : 'hover:bg-cream-light/10 text-cream/70'}`}
                >
                  <Icon size={18} className="mr-3 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-gold/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded text-cream/70 hover:bg-red-900/20 hover:text-red-300 transition-colors text-sm"
          >
            <LogOut size={18} className="mr-3 shrink-0" />
            Logout Session
          </button>
        </div>

      </aside>

      {/* Main Panel Content (flexible col) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header navbar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-earth mr-4 focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <span className="text-sm font-semibold text-gray-500 capitalize">
              Anusree Admin Console
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="bg-gold/15 text-gold-dark font-bold px-3 py-1 rounded">Store Admin</span>
          </div>
        </header>

        {/* Body content */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
