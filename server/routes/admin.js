import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  isAdminRegistered,
  registerAdmin,
  loginAdmin,
  authMiddleware,
} from '../middleware/auth.js';
import { uploadPerfumeImage } from '../middleware/upload.js';
import {
  readJson,
  writeJson,
  readSettings,
  perfumesPath,
  settingsPath,
  deleteUploadedImage,
} from '../utils/data.js';

const router = Router();

router.get('/status', (_req, res) => {
  res.json({ registered: isAdminRegistered() });
});

router.post('/register', async (req, res) => {
  try {
    const result = await registerAdmin(req.body);
    res.status(201).json({
      success: true,
      message: 'Admin account created successfully. You can now login.',
      admin: result,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await loginAdmin(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({ admin: { username: req.admin.username, email: req.admin.email } });
});

router.get('/settings', authMiddleware, (_req, res) => {
  res.json(readSettings());
});

router.put('/settings', authMiddleware, (req, res) => {
  const { storeName, phone, email, shop, socialLinks } = req.body;
  const current = readSettings();

  const updated = {
    storeName: storeName?.trim() || current.storeName,
    phone: phone?.trim() || current.phone,
    email: email?.trim() || current.email,
    shop: {
      area: shop?.area?.trim() || current.shop.area,
      address: shop?.address?.trim() || current.shop.address,
    },
    socialLinks: Array.isArray(socialLinks)
      ? socialLinks.map((link) => ({
          name: link.name?.trim() || '',
          url: link.url?.trim() || '',
          icon: link.icon?.trim() || 'instagram',
        })).filter((link) => link.name && link.url)
      : current.socialLinks,
  };

  writeJson(settingsPath, updated);
  res.json({ success: true, settings: updated });
});

router.post('/upload', authMiddleware, (req, res) => {
  uploadPerfumeImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    res.json({
      success: true,
      url: `/uploads/perfumes/${req.file.filename}`,
    });
  });
});

router.get('/perfumes', authMiddleware, (_req, res) => {
  res.json(readJson(perfumesPath));
});

router.post('/perfumes', authMiddleware, (req, res) => {
  const { name, brand, price, size, scent, image, badge, featured } = req.body;

  if (!name?.trim() || !brand?.trim() || !price || !image?.trim()) {
    return res.status(400).json({ error: 'Name, brand, price, and image are required' });
  }

  const perfumes = readJson(perfumesPath);
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let id = slug || uuidv4();

  if (perfumes.some((p) => p.id === id)) {
    id = `${slug}-${Date.now().toString(36)}`;
  }

  const perfume = {
    id,
    name: name.trim(),
    brand: brand.trim(),
    price: Number(price),
    currency: 'ETB',
    size: size?.trim() || '100ml',
    scent: scent?.trim() || '',
    image: image.trim(),
    badge: badge?.trim() || null,
    featured: !!featured,
    createdAt: new Date().toISOString(),
  };

  perfumes.push(perfume);
  writeJson(perfumesPath, perfumes);

  res.status(201).json({ success: true, perfume });
});

router.put('/perfumes/:id', authMiddleware, (req, res) => {
  const perfumes = readJson(perfumesPath);
  const index = perfumes.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Perfume not found' });
  }

  const { name, brand, price, size, scent, image, badge, featured } = req.body;
  const existing = perfumes[index];

  if (image?.trim() && image.trim() !== existing.image) {
    deleteUploadedImage(existing.image);
  }

  perfumes[index] = {
    ...existing,
    name: name?.trim() || existing.name,
    brand: brand?.trim() || existing.brand,
    price: price !== undefined ? Number(price) : existing.price,
    size: size?.trim() || existing.size,
    scent: scent?.trim() ?? existing.scent,
    image: image?.trim() || existing.image,
    badge: badge !== undefined ? (badge?.trim() || null) : existing.badge,
    featured: featured !== undefined ? !!featured : existing.featured,
    updatedAt: new Date().toISOString(),
  };

  writeJson(perfumesPath, perfumes);
  res.json({ success: true, perfume: perfumes[index] });
});

router.delete('/perfumes/:id', authMiddleware, (req, res) => {
  const perfumes = readJson(perfumesPath);
  const perfume = perfumes.find((p) => p.id === req.params.id);

  if (!perfume) {
    return res.status(404).json({ error: 'Perfume not found' });
  }

  deleteUploadedImage(perfume.image);
  const filtered = perfumes.filter((p) => p.id !== req.params.id);
  writeJson(perfumesPath, filtered);

  res.json({ success: true, message: 'Perfume deleted' });
});

export default router;
