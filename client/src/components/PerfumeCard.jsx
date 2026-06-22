import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function PerfumeCard({ perfume, index = 0 }) {
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -8 }}
      className="group relative perfume-card-glow rounded-2xl bg-warm/50 dark:bg-brand-800/40 border border-brand-200/60 dark:border-brand-700/40 overflow-hidden"
    >
      {perfume.badge && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
          className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold bg-brand-500 text-cream"
        >
          {perfume.badge}
        </motion.span>
      )}

      <div className="relative aspect-[3/4] bg-cream dark:bg-brand-900/50 overflow-hidden">
        <motion.img
          src={perfume.image}
          alt={perfume.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.12 }}
          transition={{ duration: 0.7 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <motion.button
          onClick={() => addToCart(perfume)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          aria-label={t('cart.add', { name: perfume.name })}
          className="absolute bottom-4 right-4 z-10 flex items-center gap-1 btn-icon !text-cream opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          <ShoppingCart className="w-5 h-5" strokeWidth={2} />
        </motion.button>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500 dark:text-peach">
            {perfume.brand}
          </span>
          <span className="text-xs text-brand-300">•</span>
          <span className="text-xs text-brand-600/70 dark:text-warm/70">{perfume.size}</span>
        </div>

        <h3 className="font-display text-xl mb-1 text-brand-800 dark:text-cream italic">{perfume.name}</h3>
        <p className="text-sm text-brand-600/80 dark:text-warm/70 mb-4">{perfume.scent}</p>

        <div className="flex items-center justify-between">
          <p className="text-xl font-display text-brand-500 dark:text-peach">{formatPrice(perfume.price, lang)}</p>

          <motion.button
            onClick={() => addToCart(perfume)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={t('cart.add', { name: perfume.name })}
            className="btn-icon md:hidden"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <ShoppingCart className="w-5 h-5" strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
