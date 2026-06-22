import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowLeft, PartyPopper } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice, getPaymentMethods } from '../utils/format';

export default function Order() {
  const { items, total, clearCart } = useCart();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '' });
  const [status, setStatus] = useState('idle');
  const [orderResult, setOrderResult] = useState(null);

  const paymentMethods = useMemo(() => getPaymentMethods(t), [t]);

  const handleChange = (e) => {
    setCustomer((c) => ({ ...c, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMethod) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            brand: i.brand,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            scent: i.scent,
          })),
          paymentMethod,
          total,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');

      setOrderResult({ ...data, message: t('order.success') });
      setStatus('success');
      clearCart();
    } catch (err) {
      setStatus('error');
      setOrderResult({ message: err.message });
    }
  };

  if (items.length === 0 && status !== 'success') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-600/70 mb-4">{t('order.noItems')}</p>
          <Link to="/prices" className="btn-text">{t('order.browse')}</Link>
        </div>
      </div>
    );
  }

  if (status === 'success' && orderResult) {
    return (
      <div className="min-h-screen pt-24 md:pt-28 pb-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="max-w-md w-full text-center p-8 md:p-10 rounded-3xl bg-warm/60 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40"
        >
          <PartyPopper className="w-12 h-12 mx-auto mb-6 text-brand-500" strokeWidth={2} />

          <h1 className="font-display text-3xl mb-3 text-brand-800 dark:text-cream italic">
            {t('order.placed')}
          </h1>
          <p className="text-brand-600/70 dark:text-warm/60 mb-6">{orderResult.message}</p>

          {orderResult.order && (
            <div className="p-4 rounded-xl bg-cream/80 dark:bg-brand-900/50 text-left space-y-2 mb-6">
              <p className="text-sm">
                <span className="text-brand-600/60">{t('order.orderNumber')}:</span>{' '}
                <span className="font-semibold">{orderResult.order.orderNumber}</span>
              </p>
              <p className="text-sm">
                <span className="text-brand-600/60">{t('order.total')}:</span>{' '}
                <span className="font-semibold font-display text-brand-500">{formatPrice(orderResult.order.total, lang)}</span>
              </p>
              <p className="text-sm">
                <span className="text-brand-600/60">{t('order.payment')}:</span>{' '}
                <span className="font-semibold capitalize">{orderResult.order.paymentMethod}</span>
              </p>
            </div>
          )}

          <Link to="/" className="btn-magic">
            {t('order.backHome')}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16">
      <div className="container-custom px-4 sm:px-6 lg:px-8 max-w-3xl">
        <button
          onClick={() => navigate('/cart')}
          className="btn-text mb-6 !text-brand-600/70"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          {t('order.backCart')}
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl mb-2 text-brand-800 dark:text-cream italic">
            {t('order.title')}
          </h1>
          <p className="text-brand-600/70 dark:text-warm/60 mb-8">
            {t('order.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-warm/50 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40"
          >
            <h2 className="font-display text-xl mb-4 text-brand-800 dark:text-cream italic">{t('order.summary')}</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-brand-600/60">{t('order.qty')}: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity, lang)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-brand-200/50 dark:border-brand-700/40 flex justify-between">
              <span className="font-semibold">{t('cart.total')}</span>
              <span className="text-xl font-display text-brand-500 dark:text-peach">{formatPrice(total, lang)}</span>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-warm/50 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40 space-y-4"
            >
              <h2 className="font-display text-xl text-brand-800 dark:text-cream italic">{t('order.details')}</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t('order.fullName')} *</label>
                  <input
                    type="text"
                    name="name"
                    value={customer.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    placeholder={t('order.fullNamePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t('contact.phone')} *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    placeholder={t('contact.phonePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">{t('contact.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  placeholder={t('contact.emailPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">{t('order.address')}</label>
                <input
                  type="text"
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  placeholder={t('order.addressPlaceholder')}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-warm/50 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40"
            >
              <h2 className="font-display text-xl mb-4 text-brand-800 dark:text-cream italic">{t('order.paymentMethod')} *</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all bg-transparent ${
                      paymentMethod === method.id
                        ? 'border-brand-500 dark:border-peach'
                        : 'border-brand-200/60 dark:border-brand-700 hover:border-brand-400'
                    }`}
                  >
                    {paymentMethod === method.id && (
                      <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-brand-500 dark:text-peach" strokeWidth={2.5} />
                    )}
                    <div className="h-12 mb-3 flex items-center p-1.5 rounded-lg bg-white dark:bg-white/95">
                      <img
                        src={method.logo}
                        alt={`${method.name} logo`}
                        className="h-full w-auto max-w-full object-contain"
                      />
                    </div>
                    <p className="font-semibold text-sm">{method.name}</p>
                    <p className="text-xs text-brand-600/60 dark:text-warm/50 mt-1">{method.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {status === 'error' && (
              <p className="text-brand-500 text-sm text-center">{orderResult?.message}</p>
            )}

            <motion.button
              type="submit"
              disabled={status === 'loading' || !paymentMethod}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-magic w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                t('order.place', { total: formatPrice(total, lang) })
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
