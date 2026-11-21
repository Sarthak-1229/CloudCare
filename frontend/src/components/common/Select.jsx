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
          className="block text-xs font-semibold uppercase tracking-wider text-ios-gray-600 mb-1.5 ml-1"
        >
          {label} {required && <span className="text-ios-red">*</span>}
        </label>
      )}
      <div className="relative rounded-[14px] bg-white transition-all duration-150">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ios-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <select
          id={selectId}
          required={required}
          className={`
            w-full appearance-none rounded-[14px] bg-ios-gray-50/80 border text-ios-gray-900 text-sm py-2.5 transition-all duration-150
            focus:bg-white focus:outline-none focus:ring-4 cursor-pointer
            ${Icon ? 'pl-11' : 'pl-3.5'} pr-10
            ${
              error
                ? 'border-ios-red focus:border-ios-red focus:ring-red-100'
                : 'border-ios-gray-200/90 focus:border-ios-blue focus:ring-ios-blue/15 hover:border-ios-gray-300'
            }
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-ios-gray-500">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-ios-red font-medium ml-1">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-xs text-ios-gray-500 ml-1">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
