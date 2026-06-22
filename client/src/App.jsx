import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { AdminProtectedRoute, AdminGuestRoute } from './components/AdminRoute';
import Home from './pages/Home';
import Prices from './pages/Prices';
import Cart from './pages/Cart';
import Order from './pages/Order';
import AdminRegister from './pages/admin/AdminRegister';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';

function StoreLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <StoreRoutes />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

function StoreRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route
          path="/admin/register"
          element={
            <AdminGuestRoute allowRegister>
              <AdminRegister />
            </AdminGuestRoute>
          }
        />
        <Route
          path="/admin/login"
          element={
            <AdminGuestRoute>
              <AdminLogin />
            </AdminGuestRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminProtectedRoute>
              <AdminSettings />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StoreLayout />
    </div>
  );
}
