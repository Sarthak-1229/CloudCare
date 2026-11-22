import React from 'react';

const Select = ({
  label,
  error,
  helperText,
  icon: Icon,
  children,
  className = '',
  id,
  required,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block font-mono text-[11px] uppercase tracking-wider text-[#6E6A63] font-medium mb-1.5 ml-0.5"
        >
          {label} {required && <span className="text-[#C85A32]">*</span>}
        </label>
      )}
      <div className="relative rounded-xl bg-[#F3F1ED] transition-all duration-150">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C968E]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          id={selectId}
          required={required}
          className={`
            w-full h-11 sm:h-12 appearance-none rounded-xl bg-[#F3F1ED] border text-[#18181B] text-sm transition-all duration-150
            focus:bg-white focus:outline-none focus:ring-2 cursor-pointer
            ${Icon ? 'pl-10' : 'pl-3.5'} pr-10
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-[#ECE9E2] focus:border-[#C85A32] focus:ring-[#C85A32]/20 hover:border-[#DCD7CE]'
            }
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#9C968E]">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 font-mono text-[11px] text-red-600 ml-0.5">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-xs text-[#9C968E] ml-0.5">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
