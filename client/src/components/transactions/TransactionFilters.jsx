import React, { useMemo, useState } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import useStore from '../../store/useStore';
import { TRANSACTION_STATUS, PAYMENT_GATEWAYS } from '../../utils/constants';

const TransactionFilters = ({ onApplyFilters, onClearFilters, loading }) => {
  const { filters, setFilters } = useStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleApply = (next) => {
    setFilters(next);
    onApplyFilters(next);
  };

  const toggleStatus = (statusValue) => {
    const current = Array.isArray(filters.status) ? filters.status : [];
    const exists = current.includes(statusValue);
    const next = { ...filters, status: exists ? current.filter(s => s !== statusValue) : [...current, statusValue] };
    handleApply(next);
  };

  const handleSchoolIdsChange = (value) => {
    const list = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const next = { ...filters, schoolId: list };
    handleApply(next);
  };

  const handleFieldChange = (key, value) => {
    const next = { ...filters, [key]: value };
    handleApply(next);
  };

  const handleClearFilters = () => {
    onClearFilters();
    setShowAdvanced(false);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (Array.isArray(filters.status) && filters.status.length) count++;
    if (Array.isArray(filters.schoolId) && filters.schoolId.length) count++;
    if (filters.gateway) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    return count;
  }, [filters]);

  const schoolInputValue = Array.isArray(filters.schoolId) ? filters.schoolId.join(',') : (filters.schoolId || '');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => handleFieldChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Status Filter (multi-select) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <div className="flex flex-col space-y-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              {[TRANSACTION_STATUS.SUCCESS, TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.FAILED].map((s) => (
                <label key={s} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.status) ? filters.status.includes(s) : false}
                    onChange={() => toggleStatus(s)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gateway Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gateway</label>
            <select
              value={filters.gateway}
              onChange={(e) => handleFieldChange('gateway', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Gateways</option>
              {PAYMENT_GATEWAYS.map((gateway) => (
                <option key={gateway} value={gateway}>
                  {gateway}
                </option>
              ))}
            </select>
          </div>

          {/* School IDs (multi) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School IDs (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. 65b0e6..., 65b0e7..."
              value={schoolInputValue}
              onChange={(e) => handleSchoolIdsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date From</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFieldChange('dateFrom', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">Date To</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFieldChange('dateTo', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
