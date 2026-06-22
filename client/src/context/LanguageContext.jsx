import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translate } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('shito-lang');
    return saved === 'am' ? 'am' : 'en';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang === 'am' ? 'am' : 'en';
    root.classList.toggle('lang-am', lang === 'am');
    root.classList.toggle('lang-en', lang === 'en');
    localStorage.setItem('shito-lang', lang);
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next === 'am' ? 'am' : 'en');
  }, []);

  const t = useCallback(
    (key, vars) => translate(lang, key, vars),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isAmharic: lang === 'am' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
