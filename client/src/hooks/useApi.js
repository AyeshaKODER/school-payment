import { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';

const mapFiltersToParams = (filters = {}) => {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.gateway) params.gateway = filters.gateway;
  if (Array.isArray(filters.status) && filters.status.length) params.status = filters.status.join(',');
  // Match backend README parameter names (camelCase)
  if (Array.isArray(filters.schoolId) && filters.schoolId.length) params.schoolId = filters.schoolId.join(',');
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  if (filters.sort) params.sort = filters.sort;
  if (filters.order) params.order = filters.order;
  return params;
};

export const useTransactions = (filters = {}, page = 1, limit = 10) => {
  const [data, setData] = useState({
    transactions: [],
    totalPages: 0,
    totalCount: 0,
    currentPage: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit,
        ...mapFiltersToParams(filters),
      };

      const response = await transactionAPI.getTransactions(params);
      
      setData({
        transactions: response.data.transactions || [],
        totalPages: response.data.totalPages || 0,
        totalCount: response.data.totalCount || 0,
        currentPage: response.data.currentPage || 1
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      setData({
        transactions: [],
        totalPages: 0,
        totalCount: 0,
        currentPage: 1
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, JSON.stringify(filters)]);

  return {
    ...data,
    loading,
    error,
    refetch: fetchTransactions
  };
};

export const useSchoolTransactions = (schoolId, filters = {}, page = 1, limit = 10) => {
  const [data, setData] = useState({
    transactions: [],
    totalPages: 0,
    totalCount: 0,
    currentPage: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchoolTransactions = async () => {
    if (!schoolId) {
      setData({
        transactions: [],
        totalPages: 0,
        totalCount: 0,
        currentPage: 1
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit,
        ...mapFiltersToParams(filters),
      };

      const response = await transactionAPI.getSchoolTransactions(schoolId, params);
      
      setData({
        transactions: response.data.transactions || [],
        totalPages: response.data.totalPages || 0,
        totalCount: response.data.totalCount || 0,
        currentPage: response.data.currentPage || 1
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch school transactions');
      setData({
        transactions: [],
        totalPages: 0,
        totalCount: 0,
        currentPage: 1
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId, page, limit, JSON.stringify(filters)]);

  return {
    ...data,
    loading,
    error,
    refetch: fetchSchoolTransactions
  };
};
