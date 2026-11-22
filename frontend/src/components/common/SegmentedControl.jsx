import React from 'react';

const SegmentedControl = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center p-1 bg-[#EFEAE1] rounded-full border border-[#E8E0D5]/70 max-w-full overflow-x-auto ${className}`}
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
              relative px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap select-none ios-press-action flex items-center gap-1.5
              ${
                isSelected
                  ? 'bg-white text-[#231F20] shadow-[0_2px_8px_rgba(60,45,30,0.08)]'
                  : 'text-[#7A7267] hover:text-[#231F20]'
              }
            `}
          >
            <span>{optionLabel}</span>
            {optionBadge !== undefined && optionBadge !== null && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? 'bg-[#E06D53] text-white'
                    : 'bg-[#E8E0D5] text-[#7A7267]'
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
