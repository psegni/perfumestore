import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'am', label: 'አማ', name: 'አማርኛ' },
];

export default function LanguageSwitcher({ light = false }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const textClass = light
    ? 'text-cream hover:text-peach'
    : 'text-brand-700 dark:text-warm hover:text-brand-500 dark:hover:text-peach';

  return (
    <div ref={ref} className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Select language"
        aria-expanded={open}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full border-2 bg-transparent transition-colors ${textClass} ${
          light ? 'border-cream/40 hover:border-cream' : 'border-brand-300/60 dark:border-brand-600 hover:border-brand-500 dark:hover:border-peach'
        }`}
      >
        <Globe className="w-4 h-4" strokeWidth={2} />
        <span className="text-xs font-bold tracking-wide">{current.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3 h-3" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 min-w-[140px] py-1 rounded-xl glass shadow-xl shadow-brand-500/10 border border-brand-200/50 dark:border-brand-700/50 overflow-hidden z-50"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors ${
                  lang === l.code
                    ? 'text-brand-500 dark:text-peach font-semibold bg-brand-500/5'
                    : 'text-brand-700 dark:text-warm hover:bg-warm/50 dark:hover:bg-brand-800/50'
                }`}
              >
                <span className="font-bold">{l.label}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
