import { useEffect, useState } from 'react';

const DEFAULT_SETTINGS = {
  storeName: 'Shito Store',
  phone: '+251 900 000 000',
  email: 'info@shitostore.et',
  shop: { area: 'Bole, Addis Ababa', address: 'Morning Star Mall, 2nd Floor, Shop #12' },
  socialLinks: [],
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => setSettings(DEFAULT_SETTINGS))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}

export function phoneTelLink(phone) {
  return `tel:${phone.replace(/\s/g, '')}`;
}
