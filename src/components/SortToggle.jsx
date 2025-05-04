/*'use client';

import { useState } from 'react';

export default function SortToggle({ onSortChange }) {
  const [sortOrder, setSortOrder] = useState('desc');

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    onSortChange(newOrder);
  };

  return (
    <button
      onClick={toggleSortOrder}
      className="px-4 py-2 bg-gray-200 text-black rounded"
    >
      Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
    </button>
  );
}*/
