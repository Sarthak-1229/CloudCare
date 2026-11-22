import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const norm = (status || '').toUpperCase();

  const styles = {
    CONFIRMED: {
      bg: 'bg-[#EDF4F0] text-[#5B8A72] border-[#C4DDD0]',
      dot: 'bg-[#5B8A72]',
      pulse: false,
      label: 'Confirmed',
    },
    PENDING: {
      bg: 'bg-[#FDF6ED] text-[#D98A3C] border-[#F5DDC0]',
      dot: 'bg-[#D98A3C]',
      pulse: true,
      label: 'Pending Review',
    },
    COMPLETED: {
      bg: 'bg-[#FDF2F0] text-[#E06D53] border-[#FAD8D2]',
      dot: 'bg-[#E06D53]',
      pulse: false,
      label: 'Completed',
    },
    CANCELLED: {
      bg: 'bg-[#F5F0E6] text-[#7A7267] border-[#E8E0D5]',
      dot: 'bg-[#7A7267]',
      pulse: false,
      label: 'Cancelled',
    },
  };

  const current = styles[norm] || {
    bg: 'bg-[#F5F0E6] text-[#7A7267] border-[#E8E0D5]',
    dot: 'bg-[#7A7267]',
    pulse: false,
    label: status || 'Unknown',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-2xs ${current.bg} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {current.pulse && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D98A3C] opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`} />
      </span>
      {current.label}
    </span>
  );
};

export default StatusBadge;
