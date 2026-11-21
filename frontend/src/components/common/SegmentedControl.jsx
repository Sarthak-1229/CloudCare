import React from 'react';

const SegmentedControl = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center p-1 bg-ios-gray-200/90 rounded-full border border-gray-200/60 max-w-full overflow-x-auto ${className}`}
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
              relative px-3.5 py-1.5 text-xs md:text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap select-none ios-press-action flex items-center gap-1.5
              ${
                isSelected
                  ? 'bg-white text-ios-gray-900 shadow-sm'
                  : 'text-ios-gray-600 hover:text-ios-gray-900'
              }
            `}
          >
            <span>{optionLabel}</span>
            {optionBadge !== undefined && optionBadge !== null && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-ios-blue text-white' : 'bg-gray-300 text-gray-700'
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
