import { useEffect, useState } from 'react';

export function usePerfumes() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/perfumes')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch perfumes');
        return res.json();
      })
      .then(setPerfumes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { perfumes, loading, error };
}
