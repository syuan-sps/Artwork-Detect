import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FilterOptions } from '../types';

export function useFilterOptions() {
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.filterOptions()
      .then(setOptions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { options, loading };
}
