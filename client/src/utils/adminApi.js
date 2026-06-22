const API = '/api';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('shito-admin-token');
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const adminApi = {
  status: () => apiFetch('/admin/status'),
  register: (body) => apiFetch('/admin/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiFetch('/admin/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => apiFetch('/admin/me'),
  getSettings: () => apiFetch('/admin/settings'),
  updateSettings: (body) => apiFetch('/admin/settings', { method: 'PUT', body: JSON.stringify(body) }),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetch('/admin/upload', { method: 'POST', body: formData });
  },
  getPerfumes: () => apiFetch('/admin/perfumes'),
  createPerfume: (body) => apiFetch('/admin/perfumes', { method: 'POST', body: JSON.stringify(body) }),
  updatePerfume: (id, body) => apiFetch(`/admin/perfumes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePerfume: (id) => apiFetch(`/admin/perfumes/${id}`, { method: 'DELETE' }),
};
