import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  required,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
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
        <input
          id={inputId}
          type={type}
          required={required}
          className={`
            w-full rounded-[14px] bg-ios-gray-50/80 border text-ios-gray-900 text-sm py-2.5 transition-all duration-150
            placeholder:text-ios-gray-400 focus:bg-white focus:outline-none focus:ring-4
            ${Icon ? 'pl-11' : 'pl-3.5'} pr-3.5
            ${
              error
                ? 'border-ios-red focus:border-ios-red focus:ring-red-100'
                : 'border-ios-gray-200/90 focus:border-ios-blue focus:ring-ios-blue/15 hover:border-ios-gray-300'
            }
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-ios-red font-medium ml-1">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-xs text-ios-gray-500 ml-1">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
