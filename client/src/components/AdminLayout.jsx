import { Link, useLocation } from 'react-router-dom';
import { LogOut, Package, Settings } from 'lucide-react';
import Logo from './Logo';
import { useAdminAuth } from '../context/AdminAuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Perfumes', icon: Package },
  { to: '/admin/settings', label: 'Store Settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-brand-900">
      <header className="bg-warm/80 dark:bg-brand-800 border-b border-brand-200/50 dark:border-brand-700/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <Logo className="h-9 w-auto" alt="Shito Perfumes Admin" />
            <span className="font-display text-lg text-brand-800 dark:text-cream italic hidden sm:inline">Admin</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-brand-600/70 dark:text-warm/60 hidden sm:block">
              {admin?.username}
            </span>
            <Link
              to="/"
              className="text-sm text-brand-500 dark:text-peach hover:opacity-70 transition-opacity"
            >
              View Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm btn-icon !text-brand-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-brand-200/40 dark:border-brand-700/30">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  active
                    ? 'border-brand-500 dark:border-peach text-brand-500 dark:text-peach'
                    : 'border-transparent text-brand-600/70 dark:text-warm/60 hover:text-brand-500 dark:hover:text-peach'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
