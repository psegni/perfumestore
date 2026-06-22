import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SLIDE_META = [
  { id: 1, image: 'https://images.unsplash.com/photo-1595425970375-c29daee45b00?w=1400&h=900&fit=crop', gradient: 'from-brand-900/90 via-brand-800/50 to-transparent' },
  { id: 2, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1400&h=900&fit=crop', gradient: 'from-brand-900/90 via-brand-500/30 to-transparent' },
  { id: 3, image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1400&h=900&fit=crop', gradient: 'from-brand-900/90 via-brand-800/40 to-transparent' },
];

function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: 4 + Math.random() * 8,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{ width: p.size, height: p.size, left: p.left, top: p.top }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSlideshow() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const slides = useMemo(
    () =>
      SLIDE_META.map((meta) => ({
        ...meta,
        title: t(`hero.slide${meta.id}.title`),
        subtitle: t(`hero.slide${meta.id}.subtitle`),
        description: t(`hero.slide${meta.id}.description`),
        cta: t(`hero.slide${meta.id}.cta`),
      })),
    [t]
  );

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section id="home" className="relative h-screen min-h-[600px] max-h-[950px] overflow-hidden bg-brand-900">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={`${slide.id}-${slide.title}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            src={slide.image}
            alt={slide.title}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'linear' }}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-brand-900/40" />
        </motion.div>
      </AnimatePresence>

      <FloatingParticles />

      <div className="absolute inset-0 flex items-center z-10">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}-${slide.title}`}
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 text-sm font-medium mb-6 text-peach"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                {t('hero.badge')}
              </motion.div>

              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream leading-[0.95] mb-5 italic">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-peach/90 font-light mb-4 tracking-wide">{slide.subtitle}</p>
              <p className="text-cream/70 text-base md:text-lg mb-10 max-w-lg leading-relaxed">{slide.description}</p>

              <Link to="/prices" className="btn-magic-light group">
                {slide.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-5 z-10">
        <motion.button
          onClick={prev}
          whileHover={{ scale: 1.2, x: -3 }}
          whileTap={{ scale: 0.9 }}
          aria-label={t('hero.prevSlide')}
          className="btn-icon !text-cream/80 hover:!text-cream"
        >
          <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
        </motion.button>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent(i)}
              whileHover={{ scale: 1.2 }}
              aria-label={t('hero.goToSlide', { n: i + 1 })}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? 'w-10 bg-peach' : 'w-2 bg-cream/30 hover:bg-cream/60'
              }`}
            />
          ))}
        </div>

        <motion.button
          onClick={next}
          whileHover={{ scale: 1.2, x: 3 }}
          whileTap={{ scale: 0.9 }}
          aria-label={t('hero.nextSlide')}
          className="btn-icon !text-cream/80 hover:!text-cream"
        >
          <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
        </motion.button>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream dark:from-brand-900 to-transparent z-[6]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      />
    </section>
  );
}
