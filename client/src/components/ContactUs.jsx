import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import SocialIcon from './SocialIcon';
import { useSettings, phoneTelLink } from '../hooks/useSettings';
import { useLanguage } from '../context/LanguageContext';

export default function ContactUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { settings } = useSettings();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || t('contact.error'));

      setStatus('success');
      setFeedback(t('contact.success'));
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
      setFeedback(err.message);
    }
  };

  return (
    <section id="contact" className="section-padding bg-warm/60 dark:bg-brand-800/20 relative overflow-hidden">
      <motion.div
        className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-500/5 blur-3xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="container-custom relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-brand-500 dark:text-peach font-semibold text-sm uppercase tracking-[0.2em]">
            {t('contact.label')}
          </span>
          <h2 className="font-display text-4xl md:text-6xl mt-3 mb-4 text-brand-800 dark:text-cream italic">
            {t('contact.title')}
          </h2>
          <p className="text-brand-600/80 dark:text-warm/70 max-w-xl mx-auto">
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="p-6 rounded-2xl bg-cream/80 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40">
              <h3 className="font-display text-xl mb-5 text-brand-800 dark:text-cream italic">{t('contact.followUs')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {settings.socialLinks.map((social, i) => (
                  <motion.a
                    key={`${social.name}-${i}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 15 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    whileHover={{ scale: 1.05, x: 4 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:text-brand-500 dark:hover:text-peach transition-colors group"
                  >
                    <span className="text-brand-500 dark:text-peach group-hover:scale-125 transition-transform duration-300">
                      <SocialIcon name={social.icon} className="w-5 h-5" />
                    </span>
                    <span className="font-medium text-sm">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl border-2 border-brand-500 dark:border-peach"
            >
              <h3 className="font-display text-xl mb-2 text-brand-800 dark:text-cream italic">{t('contact.directLine')}</h3>
              <p className="text-brand-600/70 dark:text-warm/60 text-sm mb-3">{t('contact.directHint')}</p>
              <a
                href={phoneTelLink(settings.phone)}
                className="text-2xl font-display text-brand-500 dark:text-peach hover:underline"
              >
                {settings.phone}
              </a>
              <p className="text-brand-600/60 dark:text-warm/50 text-sm mt-2">{settings.email}</p>
            </motion.div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 p-6 md:p-8 rounded-2xl bg-cream/80 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40 space-y-5"
          >
            <h3 className="font-display text-xl text-brand-800 dark:text-cream italic">{t('contact.formTitle')}</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('contact.name')} *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-warm/50 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                  placeholder={t('contact.namePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('contact.email')} *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-warm/50 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                  placeholder={t('contact.emailPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">{t('contact.phone')}</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-warm/50 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                placeholder={t('contact.phonePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">{t('contact.message')} *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-warm/50 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all resize-none"
                placeholder={t('contact.messagePlaceholder')}
              />
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                  status === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}
              >
                {status === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
                {feedback}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-magic disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {t('contact.send')}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
