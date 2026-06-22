import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ShoppingCart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const { t } = useLanguage();
  const { itemCount } = useCart();
  const location = useLocation();

  const navLinks = [
    { label: t('nav.home'), to: '/#home', key: 'home' },
    { label: t('nav.prices'), to: '/prices', key: 'prices' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHomeHero = location.pathname === '/' && !scrolled;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-brand-500/5 dark:shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center group">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Logo className="h-10 sm:h-11 md:h-12 w-auto" alt={t('brand.name')} />
          </motion.div>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              onClick={link.key === 'home' ? handleHomeClick : undefined}
              className={`relative font-medium transition-colors group py-1 ${
                isHomeHero
                  ? 'text-cream/90 hover:text-cream'
                  : 'text-brand-700 dark:text-warm hover:text-brand-500 dark:hover:text-peach'
              }`}
            >
              {link.label}
              <motion.span
                className={`absolute -bottom-1 left-0 h-0.5 ${
                  isHomeHero ? 'bg-cream' : 'bg-brand-500 dark:bg-peach'
                }`}
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <LanguageSwitcher light={isHomeHero} />

          <motion.button
            onClick={toggleTheme}
            aria-label={t('nav.toggleTheme')}
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className={`btn-icon ${isHomeHero ? '!text-cream' : ''}`}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <Sun className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Moon className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <Link to="/cart" className="relative group">
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`btn-icon ${isHomeHero ? '!text-cream' : ''}`}
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={2} />
            </motion.div>
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isHomeHero
                      ? 'bg-cream text-brand-500'
                      : 'bg-brand-500 text-cream'
                  }`}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden btn-icon ${isHomeHero ? '!text-cream' : ''}`}
            aria-label={t('nav.toggleMenu')}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-brand-200/50 dark:border-brand-700/50"
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={link.to}
                    onClick={link.key === 'home' ? handleHomeClick : undefined}
                    className="block py-3 px-4 rounded-xl hover:text-brand-500 dark:hover:text-peach font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
