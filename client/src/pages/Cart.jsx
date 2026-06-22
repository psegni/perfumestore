import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/format';

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const { t, lang } = useLanguage();
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16">
      <div className="container-custom px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl md:text-5xl text-brand-800 dark:text-cream italic">
            {t('cart.title')}
          </h1>
          <p className="text-brand-600/70 dark:text-warm/60 mt-2">
            {items.length === 0
              ? t('cart.empty')
              : t('cart.itemCount', { count: itemCount })}
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-12 h-12 mx-auto mb-6 text-brand-400" strokeWidth={1.5} />
            <p className="text-brand-600/70 dark:text-warm/60 mb-6">{t('cart.noItems')}</p>
            <Link to="/prices" className="btn-magic">
              {t('cart.browse')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-4 p-4 md:p-5 rounded-2xl bg-warm/50 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 md:w-24 md:h-28 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-xs font-semibold text-brand-500 dark:text-peach uppercase">{item.brand}</p>
                      <h3 className="font-display truncate text-brand-800 dark:text-cream italic">{item.name}</h3>
                      <p className="text-sm text-brand-600/70 dark:text-warm/60">
                        {item.size} • {item.scent}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => removeFromCart(item.id)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="btn-icon !text-red-400 hover:!text-red-500 shrink-0"
                      aria-label={t('cart.remove')}
                    >
                      <Trash2 className="w-5 h-5" strokeWidth={2} />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="btn-icon"
                        aria-label={t('cart.decrease')}
                      >
                        <Minus className="w-5 h-5" strokeWidth={2.5} />
                      </motion.button>
                      <span className="w-6 text-center font-semibold">{item.quantity}</span>
                      <motion.button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="btn-icon"
                        aria-label={t('cart.increase')}
                      >
                        <Plus className="w-5 h-5" strokeWidth={2.5} />
                      </motion.button>
                    </div>

                    <p className="font-display text-lg text-brand-500 dark:text-peach">
                      {formatPrice(item.price * item.quantity, lang)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-warm/60 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium">{t('cart.total')}</span>
                <span className="text-2xl font-display text-brand-500 dark:text-peach">
                  {formatPrice(total, lang)}
                </span>
              </div>

              <Link to="/order" className="btn-magic w-full justify-center">
                {t('cart.proceed')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
