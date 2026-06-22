import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { MapPin, Clock, Shield, Truck, Star, Phone } from 'lucide-react';
import { useSettings, phoneTelLink } from '../hooks/useSettings';
import { useLanguage } from '../context/LanguageContext';

export default function OurShop() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { settings } = useSettings();
  const { t } = useLanguage();

  const features = useMemo(
    () => [
      { icon: Shield, title: t('shop.feature1.title'), desc: t('shop.feature1.desc') },
      { icon: Truck, title: t('shop.feature2.title'), desc: t('shop.feature2.desc') },
      { icon: Star, title: t('shop.feature3.title'), desc: t('shop.feature3.desc') },
      { icon: Clock, title: t('shop.feature4.title'), desc: t('shop.feature4.desc') },
    ],
    [t]
  );

  return (
    <section id="shop" className="section-padding relative">
      <div className="container-custom" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-brand-500 dark:text-peach font-semibold text-sm uppercase tracking-[0.2em]">
              {t('shop.label')}
            </span>
            <h2 className="font-display text-4xl md:text-6xl mt-3 mb-6 text-brand-800 dark:text-cream italic">
              {t('shop.visit', { name: t('brand.name') })}
            </h2>
            <p className="text-brand-600/80 dark:text-warm/70 leading-relaxed mb-8 text-lg">
              {t('shop.description')}
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-4 p-5 rounded-2xl bg-warm/80 dark:bg-brand-800/50 border border-brand-200/60 dark:border-brand-700/40 mb-6"
            >
              <MapPin className="w-5 h-5 text-brand-500 dark:text-peach mt-0.5 shrink-0" strokeWidth={2} />
              <div>
                <p className="font-semibold text-brand-800 dark:text-cream">{settings.shop.area}</p>
                <p className="text-sm text-brand-600/70 dark:text-warm/60 mt-1">{settings.shop.address}</p>
              </div>
            </motion.div>

            <motion.a
              href={phoneTelLink(settings.phone)}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/20 mb-8 group"
            >
              <Phone className="w-5 h-5 text-brand-500 dark:text-peach shrink-0" strokeWidth={2} />
              <div>
                <p className="text-xs uppercase tracking-wider text-brand-500 dark:text-peach font-semibold">{t('shop.callUs')}</p>
                <p className="font-display text-2xl text-brand-800 dark:text-cream group-hover:text-brand-500 dark:group-hover:text-peach transition-colors">
                  {settings.phone}
                </p>
              </div>
            </motion.a>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 25 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="flex gap-3 p-4 rounded-xl bg-cream/80 dark:bg-brand-800/40 border border-brand-200/40 dark:border-brand-700/30"
                >
                  <f.icon className="w-5 h-5 text-brand-500 dark:text-peach shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <h4 className="font-semibold text-sm text-brand-800 dark:text-cream">{f.title}</h4>
                    <p className="text-xs text-brand-600/70 dark:text-warm/60 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl shadow-brand-500/10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&h=600&fit=crop"
                alt={t('shop.imageAlt')}
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 to-transparent" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 p-6 rounded-2xl glass shadow-xl"
            >
              <p className="text-4xl font-display text-brand-500 dark:text-peach italic">1000+</p>
              <p className="text-sm text-brand-600/70 dark:text-warm/60">{t('shop.happyCustomers')}</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 p-5 rounded-2xl border-2 border-brand-500 dark:border-peach text-brand-500 dark:text-peach"
            >
              <p className="font-display text-xl italic">{t('shop.since')}</p>
              <p className="text-sm opacity-80">{t('shop.trusted')}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
