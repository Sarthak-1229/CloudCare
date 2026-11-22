import React from 'react';

const SegmentedControl = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center p-1 bg-[#F3F1ED] rounded-full border border-[#ECE9E2] max-w-full overflow-x-auto ${className}`}
    >
      {options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;
        const optionBadge = typeof option === 'object' ? option.badge : null;
        const isSelected = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={`
              relative px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-150 whitespace-nowrap select-none flex items-center gap-1.5 btn-press
              ${
                isSelected
                  ? 'bg-white text-[#18181B] border border-[rgba(28,25,23,0.08)] shadow-[0_2px_8px_rgba(28,25,23,0.06)]'
                  : 'text-[#6E6A63] hover:text-[#18181B]'
              }
            `}
          >
            <span>{optionLabel}</span>
            {optionBadge !== undefined && optionBadge !== null && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                  isSelected
                    ? 'bg-[#1C1917] text-white'
                    : 'bg-[#ECE9E2] text-[#6E6A63]'
                }`}
              >
                {optionBadge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
