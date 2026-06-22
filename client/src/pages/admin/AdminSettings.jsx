import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { adminApi } from '../../utils/adminApi';

const SOCIAL_ICONS = ['instagram', 'facebook', 'telegram', 'tiktok', 'whatsapp'];

const emptySettings = {
  storeName: '',
  phone: '',
  email: '',
  shop: { area: '', address: '' },
  socialLinks: [],
};

export default function AdminSettings() {
  const [form, setForm] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .getSettings()
      .then(setForm)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleShopChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, shop: { ...f.shop, [name]: value } }));
  };

  const handleSocialChange = (index, field, value) => {
    setForm((f) => {
      const links = [...f.socialLinks];
      links[index] = { ...links[index], [field]: value };
      return { ...f, socialLinks: links };
    });
  };

  const addSocialLink = () => {
    setForm((f) => ({
      ...f,
      socialLinks: [...f.socialLinks, { name: '', url: '', icon: 'instagram' }],
    }));
  };

  const removeSocialLink = (index) => {
    setForm((f) => ({
      ...f,
      socialLinks: f.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const data = await adminApi.updateSettings(form);
      setForm(data.settings);
      setMessage('Store settings saved! Changes are live on the website.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl text-brand-800 dark:text-cream italic">
          Store Settings
        </h1>
        <p className="text-brand-600/70 dark:text-warm/60 text-sm mt-1">
          Update contact info, shop address, and social media links shown on the store
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <section className="p-6 rounded-2xl bg-warm/50 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40 space-y-4">
          <h2 className="font-display text-xl text-brand-800 dark:text-cream italic">Contact Info</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Store Name</label>
              <input
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                placeholder="+251 9XX XXX XXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              placeholder="info@shitostore.et"
            />
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-warm/50 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40 space-y-4">
          <h2 className="font-display text-xl text-brand-800 dark:text-cream italic">Shop Address</h2>

          <div>
            <label className="block text-sm font-medium mb-1.5">Area / City</label>
            <input
              name="area"
              value={form.shop.area}
              onChange={handleShopChange}
              className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              placeholder="Bole, Addis Ababa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Address</label>
            <input
              name="address"
              value={form.shop.address}
              onChange={handleShopChange}
              className="w-full px-4 py-3 rounded-xl bg-cream/80 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              placeholder="Morning Star Mall, 2nd Floor, Shop #12"
            />
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-warm/50 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-brand-800 dark:text-cream italic">Social Media Links</h2>
            <button
              type="button"
              onClick={addSocialLink}
              className="flex items-center gap-1 text-sm btn-text"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
          </div>

          <div className="space-y-3">
            {form.socialLinks.map((link, i) => (
              <div
                key={i}
                className="grid sm:grid-cols-[1fr_2fr_auto_auto] gap-3 items-end p-3 rounded-xl bg-cream/50 dark:bg-brand-900/30"
              >
                <div>
                  <label className="block text-xs font-medium mb-1">Name</label>
                  <input
                    value={link.name}
                    onChange={(e) => handleSocialChange(i, 'name', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-cream dark:bg-brand-800 border border-brand-200/60 dark:border-brand-700 text-sm"
                    placeholder="Instagram"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">URL</label>
                  <input
                    value={link.url}
                    onChange={(e) => handleSocialChange(i, 'url', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-cream dark:bg-brand-800 border border-brand-200/60 dark:border-brand-700 text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Icon</label>
                  <select
                    value={link.icon}
                    onChange={(e) => handleSocialChange(i, 'icon', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-cream dark:bg-brand-800 border border-brand-200/60 dark:border-brand-700 text-sm"
                  >
                    {SOCIAL_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeSocialLink(i)}
                  className="btn-icon !text-red-400 self-center"
                  aria-label="Remove link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {message && (
          <p className="text-green-600 dark:text-green-400 text-sm">{message}</p>
        )}
        {error && <p className="text-brand-500 text-sm">{error}</p>}

        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          className="btn-magic"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Settings
        </motion.button>
      </motion.form>
    </AdminLayout>
  );
}
