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
          className="block text-xs font-semibold uppercase tracking-wider text-[#7A7267] mb-1.5 ml-1"
        >
          {label} {required && <span className="text-[#D34538]">*</span>}
        </label>
      )}
      <div className="relative rounded-2xl bg-[#F5F1E8] transition-all duration-150">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7A7267]">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <select
          id={selectId}
          required={required}
          className={`
            w-full h-12 appearance-none rounded-2xl bg-[#F5F1E8] border text-[#231F20] text-sm transition-all duration-150
            focus:bg-white focus:outline-none focus:ring-2 cursor-pointer
            ${Icon ? 'pl-11' : 'pl-4'} pr-10
            ${
              error
                ? 'border-[#D34538] focus:border-[#D34538] focus:ring-[#D34538]/20'
                : 'border-[#E8E0D5] focus:border-[#E06D53] focus:ring-[#E06D53]/30 hover:border-[#D5CBC0]'
            }
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#7A7267]">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-[#D34538] font-medium ml-1">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-xs text-[#7A7267] ml-1">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
