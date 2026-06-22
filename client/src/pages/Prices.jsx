import { motion } from 'framer-motion';
import { usePerfumes } from '../hooks/usePerfumes';
import { useLanguage } from '../context/LanguageContext';
import { getPerfumeCategory } from '../constants/brands';
import PerfumeCard from '../components/PerfumeCard';
import { Loader2 } from 'lucide-react';

const CATEGORY_ORDER = ['luxury', 'men', 'women', 'unisex'];

export default function Prices() {
  const { perfumes, loading, error } = usePerfumes();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 relative overflow-hidden">
      <motion.div
        className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-peach/40 dark:bg-brand-500/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-brand-500 dark:text-peach font-semibold text-sm uppercase tracking-[0.2em]">
            {t('prices.label')}
          </span>
          <h1 className="font-display text-4xl md:text-6xl mt-3 mb-4 text-brand-800 dark:text-cream italic">
            {t('prices.title')}
          </h1>
          <p className="text-brand-600/80 dark:text-warm/70 max-w-xl mx-auto">
            {t('prices.description')}
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-brand-500">
            {t('prices.loadError')}
          </div>
        )}

        {!loading && !error && <PerfumeGrid perfumes={perfumes} />}
      </div>
    </div>
  );
}

function PerfumeGrid({ perfumes }) {
  const { t } = useLanguage();

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = perfumes.filter((p) => getPerfumeCategory(p.brand) === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  const categorized = perfumes.filter((p) => CATEGORY_ORDER.includes(getPerfumeCategory(p.brand)));
  const uncategorized = perfumes.filter((p) => !categorized.includes(p));

  if (uncategorized.length) {
    grouped.all = uncategorized;
  }

  if (!perfumes.length) {
    return (
      <p className="text-center text-brand-600/70 py-20">
        {t('prices.empty')}
      </p>
    );
  }

  return (
    <div className="space-y-16">
      {Object.entries(grouped).map(([category, items], sectionIndex) => (
        <section key={category}>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="font-display text-3xl mb-8 text-brand-800 dark:text-cream italic"
          >
            {t(`category.${category}`)}
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {items.map((perfume, i) => (
              <PerfumeCard key={perfume.id} perfume={perfume} index={i} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
