import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { usePerfumes } from '../hooks/usePerfumes';
import { useLanguage } from '../context/LanguageContext';
import PerfumeCard from './PerfumeCard';

export default function NewArrivals() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { perfumes, loading } = usePerfumes();
  const { t } = useLanguage();
  const arrivals = perfumes.filter((p) => p.featured).slice(0, 4);

  if (loading || arrivals.length === 0) return null;

  return (
    <section className="section-padding relative overflow-hidden">
      <motion.div
        className="absolute top-20 right-0 w-72 h-72 rounded-full bg-peach/30 dark:bg-brand-500/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container-custom relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 text-brand-500 dark:text-peach font-semibold text-sm uppercase tracking-[0.2em]"
            >
              <Sparkles className="w-4 h-4" />
              {t('arrivals.label')}
            </motion.span>
            <h2 className="font-display text-4xl md:text-6xl mt-3 text-brand-800 dark:text-cream italic">
              {t('arrivals.title')}
            </h2>
          </div>
          <Link to="/prices" className="btn-text group">
            {t('arrivals.viewAll')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {arrivals.map((perfume, i) => (
            <PerfumeCard key={perfume.id} perfume={perfume} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
