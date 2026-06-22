import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';
import Logo from '../../components/Logo';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminRegister() {
  const { register } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      setSuccess(true);
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream dark:bg-brand-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Logo className="h-20 w-auto mx-auto mb-4" alt="Shito Perfumes" />
          <h1 className="font-display text-4xl text-brand-800 dark:text-cream italic">Admin Setup</h1>
          <p className="text-brand-600/70 dark:text-warm/60 mt-2 text-sm">
            Create your admin account — registration is only allowed once
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 rounded-2xl bg-warm/60 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40 space-y-4"
        >
          {success ? (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5 shrink-0" />
              Account created! Redirecting to login...
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1.5">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  placeholder="Admin username"
                />
              </div>
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
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  placeholder="Min. 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  placeholder="Repeat password"
                />
              </div>

              {error && <p className="text-brand-500 text-sm">{error}</p>}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                className="btn-magic w-full justify-center disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Admin Account'}
              </motion.button>
            </>
          )}

          <p className="text-center text-sm text-brand-600/70 dark:text-warm/60">
            Already have an account?{' '}
            <Link to="/admin/login" className="text-brand-500 dark:text-peach font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
