import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import adminRoutes from './routes/admin.js';
import {
  readJson,
  writeJson,
  readSettings,
  perfumesPath,
  ordersPath,
  messagesPath,
  shuffleArray,
} from './utils/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', store: 'Shito Store' });
});

app.get('/api/settings', (_req, res) => {
  res.json(readSettings());
});

app.get('/api/perfumes', (_req, res) => {
  res.json(readJson(perfumesPath));
});

app.get('/api/perfumes/:id', (req, res) => {
  const perfumes = readJson(perfumesPath);
  const perfume = perfumes.find((p) => p.id === req.params.id);
  if (!perfume) return res.status(404).json({ error: 'Perfume not found' });
  res.json(perfume);
});

app.get('/api/gallery', (_req, res) => {
  const perfumes = readJson(perfumesPath);
  if (!perfumes.length) return res.json([]);

  const shuffled = shuffleArray(perfumes);
  const count = Math.min(6, shuffled.length);
  const layoutSpans = [
    'col-span-2 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
  ];

  const gallery = shuffled.slice(0, count).map((perfume, i) => ({
    id: perfume.id,
    src: perfume.image,
    alt: perfume.name,
    span: layoutSpans[i] || 'col-span-1 row-span-1',
  }));

  res.json(gallery);
});

app.use('/api/admin', adminRoutes);

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const messages = readJson(messagesPath);
  const entry = {
    id: uuidv4(),
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || '',
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  messages.push(entry);
  writeJson(messagesPath, messages);

  res.status(201).json({
    success: true,
    message: 'Thank you! We received your message and will get back to you soon.',
    id: entry.id,
  });
});

app.post('/api/orders', (req, res) => {
  const { customer, items, paymentMethod, total } = req.body;

  if (!customer?.name?.trim() || !customer?.phone?.trim()) {
    return res.status(400).json({ error: 'Customer name and phone are required' });
  }

  if (!items?.length) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const validPayments = ['telebirr', 'cbe', 'awash'];
  if (!validPayments.includes(paymentMethod)) {
    return res.status(400).json({ error: 'Invalid payment method' });
  }

  const orders = readJson(ordersPath);
  const order = {
    id: uuidv4(),
    orderNumber: `SS-${Date.now().toString().slice(-8)}`,
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || '',
      address: customer.address?.trim() || '',
    },
    items,
    paymentMethod,
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  writeJson(ordersPath, orders);

  res.status(201).json({
    success: true,
    message: 'Your order has been placed successfully! We will contact you shortly to confirm payment.',
    order: {
      orderNumber: order.orderNumber,
      total: order.total,
      paymentMethod: order.paymentMethod,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Shito Store API running on http://localhost:${PORT}`);
});
