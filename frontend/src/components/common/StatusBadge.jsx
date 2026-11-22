import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const norm = (status || '').toUpperCase();

  const styles = {
    CONFIRMED: {
      bg: 'bg-emerald-50/90 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500',
      pulse: false,
      label: 'Confirmed',
    },
    PENDING: {
      bg: 'bg-amber-50/90 text-amber-800 border-amber-200/80',
      dot: 'bg-amber-500',
      pulse: true,
      label: 'Pending Review',
    },
    COMPLETED: {
      bg: 'bg-indigo-50/90 text-indigo-800 border-indigo-200/80',
      dot: 'bg-indigo-500',
      pulse: false,
      label: 'Completed',
    },
    CANCELLED: {
      bg: 'bg-rose-50/90 text-rose-800 border-rose-200/80',
      dot: 'bg-rose-500',
      pulse: false,
      label: 'Cancelled',
    },
  };

  const current = styles[norm] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    pulse: false,
    label: status || 'Unknown',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-2xs ${current.bg} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {current.pulse && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`} />
      </span>
      {current.label}
    </span>
  );
};

export default StatusBadge;
