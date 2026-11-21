import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const norm = (status || '').toUpperCase();

  const styles = {
    CONFIRMED: {
      bg: 'bg-ios-blue-tint',
      text: 'text-ios-blue',
      dot: 'bg-ios-blue',
      label: 'Confirmed',
    },
    PENDING: {
      bg: 'bg-ios-orange-tint',
      text: 'text-ios-orange',
      dot: 'bg-ios-orange',
      label: 'Pending',
    },
    COMPLETED: {
      bg: 'bg-ios-green-tint',
      text: 'text-ios-green',
      dot: 'bg-ios-green',
      label: 'Completed',
    },
    CANCELLED: {
      bg: 'bg-ios-red-tint',
      text: 'text-ios-red',
      dot: 'bg-ios-red',
      label: 'Cancelled',
    },
  };

  const current = styles[norm] || {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
    label: status || 'Unknown',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${current.bg} ${current.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
};

export default StatusBadge;
