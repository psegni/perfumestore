import { Link } from 'react-router-dom';
import SocialIcon from './SocialIcon';
import Logo from './Logo';
import { useSettings } from '../hooks/useSettings';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { settings } = useSettings();
  const { t } = useLanguage();

  return (
    <footer className="bg-warm/80 dark:bg-brand-800/30 border-t border-brand-200/50 dark:border-brand-700/40">
      <div className="container-custom section-padding !py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo className="h-14 w-auto" alt={t('brand.name')} />
            </div>
            <p className="text-brand-600/70 dark:text-warm/60 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-brand-800 dark:text-cream italic">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-brand-600/70 dark:text-warm/60 hover:text-brand-500 dark:hover:text-peach transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/prices" className="text-brand-600/70 dark:text-warm/60 hover:text-brand-500 dark:hover:text-peach transition-colors">{t('nav.prices')}</Link></li>
              <li><Link to="/cart" className="text-brand-600/70 dark:text-warm/60 hover:text-brand-500 dark:hover:text-peach transition-colors">{t('nav.cart')}</Link></li>
              <li><a href="/#contact" className="text-brand-600/70 dark:text-warm/60 hover:text-brand-500 dark:hover:text-peach transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-brand-800 dark:text-cream italic">{t('footer.followUs')}</h4>
            <div className="flex gap-5 flex-wrap">
              {settings.socialLinks.map((social, i) => (
                <a
                  key={`${social.name}-${i}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-brand-500 dark:text-peach hover:scale-125 transition-all duration-300"
                >
                  <SocialIcon name={social.icon} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-200/50 dark:border-brand-700/40 text-center text-sm text-brand-500/60 dark:text-warm/40">
          © {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
