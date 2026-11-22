import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const norm = (status || '').toUpperCase();

  const styles = {
    CONFIRMED: {
      bg: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
      dot: 'bg-[#10B981]',
      pulse: false,
      label: 'Confirmed',
    },
    PENDING: {
      bg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
      dot: 'bg-[#D97706]',
      pulse: true,
      label: 'Pending Review',
    },
    COMPLETED: {
      bg: 'bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]',
      dot: 'bg-[#1C1917]',
      pulse: false,
      label: 'Completed',
    },
    CANCELLED: {
      bg: 'bg-[#F3F1ED] text-[#9C968E] border-[#ECE9E2]',
      dot: 'bg-[#9C968E]',
      pulse: false,
      label: 'Cancelled',
    },
  };

  const current = styles[norm] || {
    bg: 'bg-[#F3F1ED] text-[#6E6A63] border-[#ECE9E2]',
    dot: 'bg-[#9C968E]',
    pulse: false,
    label: status || 'Unknown',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-[-0.01em] border ${current.bg} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {current.pulse && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97706] opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${current.dot}`} />
      </span>
      {current.label}
    </span>
  );
};

export default StatusBadge;
