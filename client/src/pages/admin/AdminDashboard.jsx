import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, Star, ImageIcon, Upload } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { adminApi } from '../../utils/adminApi';
import { formatPrice } from '../../utils/format';
import { PERFUME_BRANDS } from '../../constants/brands';

const emptyForm = {
  name: '',
  brand: 'Christian Dior',
  price: '',
  size: '100ml',
  scent: '',
  image: '',
  badge: '',
  featured: false,
};

export default function AdminDashboard() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const loadPerfumes = async () => {
    try {
      const data = await adminApi.getPerfumes();
      setPerfumes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerfumes();
  }, []);

  const clearImagePreview = () => {
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const openCreate = () => {
    clearImagePreview();
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setFormOpen(true);
    setError('');
  };

  const openEdit = (perfume) => {
    clearImagePreview();
    setEditing(perfume);
    setForm({
      name: perfume.name,
      brand: perfume.brand,
      price: perfume.price,
      size: perfume.size,
      scent: perfume.scent,
      image: perfume.image,
      badge: perfume.badge || '',
      featured: perfume.featured,
    });
    setImageFile(null);
    setImagePreview(perfume.image);
    setFormOpen(true);
    setError('');
  };

  const closeForm = () => {
    clearImagePreview();
    setFormOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    clearImagePreview();
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let imageUrl = form.image;

      if (imageFile) {
        const upload = await adminApi.uploadImage(imageFile);
        imageUrl = upload.url;
      } else if (!imageUrl) {
        throw new Error('Please upload a perfume image');
      }

      const payload = { ...form, image: imageUrl };

      if (editing) {
        await adminApi.updatePerfume(editing.id, payload);
      } else {
        await adminApi.createPerfume(payload);
      }

      await loadPerfumes();
      closeForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this perfume?')) return;
    try {
      await adminApi.deletePerfume(id);
      setPerfumes((p) => p.filter((perfume) => perfume.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-brand-800 dark:text-cream italic">
            Manage Perfumes
          </h1>
          <p className="text-brand-600/70 dark:text-warm/60 text-sm mt-1">
            Posted perfumes appear on the Prices page and random ones in the Gallery
          </p>
        </div>
        <motion.button
          onClick={openCreate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-magic"
        >
          <Plus className="w-5 h-5" />
          Add Perfume
        </motion.button>
      </div>

      {error && !formOpen && (
        <p className="mb-4 text-brand-500 text-sm">{error}</p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : perfumes.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-warm/50 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-brand-300" />
          <p className="text-brand-600/70 dark:text-warm/60 mb-4">No perfumes posted yet</p>
          <motion.button onClick={openCreate} whileHover={{ scale: 1.05 }} className="btn-magic">
            <Plus className="w-5 h-5" />
            Add Your First Perfume
          </motion.button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {perfumes.map((perfume, i) => (
            <motion.div
              key={perfume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-warm/50 dark:bg-brand-800/40 border border-brand-200/50 dark:border-brand-700/40 overflow-hidden"
            >
              <div className="aspect-[4/3] bg-cream dark:bg-brand-900/50 relative">
                <img src={perfume.image} alt={perfume.name} className="w-full h-full object-cover" />
                {perfume.featured && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500 text-cream text-xs">
                    <Star className="w-3 h-3" /> New Arrival
                  </span>
                )}
                {perfume.badge && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-cream/90 text-brand-500 text-xs font-semibold">
                    {perfume.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-brand-500 uppercase">{perfume.brand}</p>
                <h3 className="font-display text-lg text-brand-800 dark:text-cream italic">{perfume.name}</h3>
                <p className="text-sm text-brand-600/70 dark:text-warm/60">
                  {perfume.size} • {perfume.scent}
                </p>
                <p className="font-display text-xl mt-2 text-brand-500 dark:text-peach">
                  {formatPrice(perfume.price)}
                </p>
                <div className="flex gap-2 mt-4">
                  <motion.button
                    onClick={() => openEdit(perfume)}
                    whileHover={{ scale: 1.03 }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-brand-200/60 dark:border-brand-600 text-sm font-medium hover:border-brand-500 dark:hover:border-peach transition-colors bg-transparent"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(perfume.id)}
                    whileHover={{ scale: 1.2 }}
                    className="btn-icon !text-red-400 hover:!text-red-500"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/60 backdrop-blur-sm"
            onClick={closeForm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-cream dark:bg-brand-800 border border-brand-200/50 dark:border-brand-700/40 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-brand-800 dark:text-cream italic">
                  {editing ? 'Edit Perfume' : 'Add New Perfume'}
                </h2>
                <button onClick={closeForm} className="btn-icon">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Perfume Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-warm/50 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    placeholder="Sauvage Elixir"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Brand *</label>
                    <select
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-warm/50 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    >
                      {PERFUME_BRANDS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Price (ETB) *</label>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 rounded-xl bg-warm/50 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      placeholder="12500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Size</label>
                    <input
                      name="size"
                      value={form.size}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-warm/50 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      placeholder="100ml"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Scent Type</label>
                    <input
                      name="scent"
                      value={form.scent}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-warm/50 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      placeholder="Floral Woody"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Perfume Image *</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-brand-300 dark:border-brand-600 hover:border-brand-500 dark:hover:border-peach transition-colors bg-warm/30 dark:bg-brand-900/30"
                  >
                    <Upload className="w-6 h-6 text-brand-500" />
                    <span className="text-sm text-brand-600 dark:text-warm/70">
                      {imageFile ? imageFile.name : editing ? 'Click to change image' : 'Click to upload image'}
                    </span>
                    <span className="text-xs text-brand-400">JPG, PNG, WEBP or GIF — max 5MB</span>
                  </button>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-3 w-full h-40 rounded-xl object-cover"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Badge (optional)</label>
                  <input
                    name="badge"
                    value={form.badge}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-warm/50 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    placeholder="New, Hot, Luxury..."
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded accent-brand-500"
                  />
                  <span className="text-sm">Show in New Arrivals section on homepage</span>
                </label>

                {error && <p className="text-brand-500 text-sm">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeForm} className="flex-1 py-3 rounded-xl border-2 border-brand-200 dark:border-brand-600 font-medium bg-transparent hover:border-brand-500 transition-colors">
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    className="btn-magic flex-1 justify-center disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : editing ? 'Save Changes' : 'Post Perfume'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
