import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useLanguage();
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then(setGalleryImages)
      .catch(() => setGalleryImages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="gallery" className="section-padding bg-warm/60 dark:bg-brand-800/20 relative overflow-hidden">
      <motion.div
        className="absolute -left-20 bottom-0 w-96 h-96 rounded-full bg-brand-500/5 blur-3xl"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container-custom relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-brand-500 dark:text-peach font-semibold text-sm uppercase tracking-[0.2em]">
            {t('gallery.label')}
          </span>
          <h2 className="font-display text-4xl md:text-6xl mt-3 mb-4 text-brand-800 dark:text-cream italic">
            {t('gallery.title')}
          </h2>
          <p className="text-brand-600/80 dark:text-warm/70 max-w-xl mx-auto">
            {t('gallery.description')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : galleryImages.length === 0 ? (
          <p className="text-center text-brand-600/70 dark:text-warm/60 py-16">
            {t('gallery.empty')}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
            {galleryImages.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, type: 'spring' }}
                onHoverStart={() => setHoveredId(img.id)}
                onHoverEnd={() => setHoveredId(null)}
                className={`${img.span} relative rounded-2xl overflow-hidden group cursor-pointer`}
              >
                <motion.img
                  src={img.src}
                  alt={img.alt}
                  animate={{ scale: hoveredId === img.id ? 1.15 : 1 }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-brand-500/20 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === img.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-4"
                  initial={{ y: '100%' }}
                  animate={{ y: hoveredId === img.id ? 0 : '100%' }}
                  transition={{ duration: 0.4, type: 'spring' }}
                >
                  <p className="text-cream font-display text-lg italic">{img.alt}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
