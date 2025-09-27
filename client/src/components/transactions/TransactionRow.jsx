import React, { useState } from 'react';
import { Eye, Copy, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const TransactionRow = ({ transaction, isSelected, onSelect, getStatusColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const truncateId = (id, length = 8) => {
    if (!id) return 'N/A';
    return id.length > length ? `${id.substring(0, length)}...` : id;
  };

  return (
    <tr
      className={`table-hover-effect cursor-pointer ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Select checkbox */}
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
      </td>

      {/* collect_id */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {truncateId(transaction.collect_id)}
          </span>
          {isHovered && transaction.collect_id && (
            <button
              onClick={() => copyToClipboard(transaction.collect_id)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="Copy Collect ID"
            >
              <Copy className="h-3 w-3 text-gray-500" />
            </button>
          )}
        </div>
      </td>

      {/* school_id */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900 dark:text-white">
          {truncateId(transaction.school_id)}
        </span>
      </td>

      {/* gateway */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {transaction.gateway || 'N/A'}
        </span>
      </td>

      {/* order_amount */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatCurrency(transaction.order_amount)}
        </span>
      </td>

      {/* transaction_amount */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatCurrency(transaction.transaction_amount)}
        </span>
      </td>

      {/* status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
          {transaction.status || 'Unknown'}
        </span>
      </td>

      {/* payment_time */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900 dark:text-white">
          {formatDate(transaction.payment_time)}
        </span>
      </td>

      {/* actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => console.log('View transaction:', transaction.collect_id)}
            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => window.open(`/transaction/${transaction.collect_id}`, '_blank')}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TransactionRow;
