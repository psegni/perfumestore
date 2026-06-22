import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const adminPath = join(__dirname, '..', 'data', 'admin.json');
const JWT_SECRET = process.env.JWT_SECRET || 'shito-store-admin-secret-change-in-production';
const JWT_EXPIRES = '7d';

function readAdmin() {
  if (!existsSync(adminPath)) return null;
  return JSON.parse(readFileSync(adminPath, 'utf-8'));
}

function writeAdmin(data) {
  writeFileSync(adminPath, JSON.stringify(data, null, 2));
}

export function isAdminRegistered() {
  return !!readAdmin();
}

export async function registerAdmin({ username, email, password }) {
  if (readAdmin()) {
    throw new Error('Admin already registered. Please login.');
  }

  if (!username?.trim() || !email?.trim() || !password) {
    throw new Error('Username, email, and password are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const admin = {
    id: 'admin',
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  writeAdmin(admin);
  return { username: admin.username, email: admin.email };
}

export async function loginAdmin({ email, password }) {
  const admin = readAdmin();
  if (!admin) {
    throw new Error('No admin account found. Please register first.');
  }

  if (!email?.trim() || !password) {
    throw new Error('Email and password are required');
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, username: admin.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  return {
    token,
    admin: { username: admin.username, email: admin.email },
  };
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const payload = verifyToken(header.slice(7));
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.admin = payload;
  next();
}
