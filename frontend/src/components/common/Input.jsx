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
        <input
          id={inputId}
          type={type}
          required={required}
          className={`
            w-full h-11 sm:h-12 rounded-xl bg-[#F3F1ED] border text-[#18181B] text-sm transition-all duration-150
            placeholder:text-[#9C968E] focus:bg-white focus:outline-none focus:ring-2
            ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-[#ECE9E2] focus:border-[#C85A32] focus:ring-[#C85A32]/20 hover:border-[#DCD7CE]'
            }
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 font-mono text-[11px] text-red-600 ml-0.5">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-xs text-[#9C968E] ml-0.5">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
