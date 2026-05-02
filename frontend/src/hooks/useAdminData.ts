import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export const useAdminData = (endpoint: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err);
      toast.error(err.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData, setData };
};

export const useDashboard = () => useAdminData('/admin/dashboard');
export const useProducts = (query = '') => useAdminData(`/admin/products${query}`);
export const useOrders = (query = '') => useAdminData(`/admin/orders${query}`);
export const useUsers = (query = '') => useAdminData(`/admin/users${query}`);
export const useContent = (type: string) => useAdminData(`/admin/content/${type}`);
export const useSettings = () => useAdminData('/admin/settings');
