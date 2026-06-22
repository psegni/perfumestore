import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Logo from '../../components/Logo';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream dark:bg-brand-900 relative overflow-hidden">
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-peach/30 dark:bg-brand-500/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Logo className="h-20 w-auto mx-auto mb-4" alt="Shito Perfumes" />
          <h1 className="font-display text-4xl text-brand-800 dark:text-cream italic">Admin Login</h1>
          <p className="text-brand-600/70 dark:text-warm/60 mt-2 text-sm">
            Sign in to manage perfumes and prices
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 rounded-2xl bg-warm/60 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              placeholder="admin@shitostore.et"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              placeholder="Your password"
            />
          </div>

          {error && <p className="text-brand-500 text-sm">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-magic w-full justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
          </motion.button>

          <p className="text-center text-sm text-brand-600/70 dark:text-warm/60">
            First time?{' '}
            <Link to="/admin/register" className="text-brand-500 dark:text-peach font-semibold hover:underline">
              Register admin
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
