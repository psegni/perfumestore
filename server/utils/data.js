import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '..', 'data');
const uploadsDir = join(__dirname, '..', 'uploads', 'perfumes');

export const perfumesPath = join(dataDir, 'perfumes.json');
export const ordersPath = join(dataDir, 'orders.json');
export const messagesPath = join(dataDir, 'messages.json');
export const settingsPath = join(dataDir, 'settings.json');

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

export function getDefaultSettings() {
  return {
    storeName: 'Shito Store',
    phone: '+251 900 000 000',
    email: 'info@shitostore.et',
    shop: {
      area: 'Bole, Addis Ababa',
      address: 'Morning Star Mall, 2nd Floor, Shop #12',
    },
    socialLinks: [
      { name: 'Instagram', url: 'https://instagram.com/shitostore', icon: 'instagram' },
      { name: 'Facebook', url: 'https://facebook.com/shitostore', icon: 'facebook' },
      { name: 'Telegram', url: 'https://t.me/shitostore', icon: 'telegram' },
      { name: 'TikTok', url: 'https://tiktok.com/@shitostore', icon: 'tiktok' },
      { name: 'WhatsApp', url: 'https://wa.me/251900000000', icon: 'whatsapp' },
    ],
  };
}

export function readSettings() {
  if (!existsSync(settingsPath)) {
    const defaults = getDefaultSettings();
    writeJson(settingsPath, defaults);
    return defaults;
  }
  return JSON.parse(readFileSync(settingsPath, 'utf-8'));
}

export function readJson(path, fallback = []) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf-8'));
}

export function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2));
}

export function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function deleteUploadedImage(imagePath) {
  if (!imagePath?.startsWith('/uploads/')) return;
  const normalized = join(__dirname, '..', ...imagePath.split('/').filter(Boolean));
  if (existsSync(normalized)) {
    try {
      unlinkSync(normalized);
    } catch {}
  }
}

export { uploadsDir };

export const ALLOWED_IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

export function isAllowedImage(filename) {
  return ALLOWED_IMAGE_EXT.has(extname(filename).toLowerCase());
}
