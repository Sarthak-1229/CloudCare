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
          className="block text-xs font-semibold text-[#7A7267] uppercase tracking-wider mb-1.5 ml-1"
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
        <input
          id={inputId}
          type={type}
          required={required}
          className={`
            w-full h-12 rounded-2xl bg-[#F5F1E8] border text-[#231F20] text-sm transition-all duration-150
            placeholder:text-[#7A7267]/60 focus:bg-white focus:outline-none focus:ring-2
            ${Icon ? 'pl-11' : 'pl-4'} pr-4
            ${
              error
                ? 'border-[#D34538] focus:border-[#D34538] focus:ring-[#D34538]/20'
                : 'border-[#E8E0D5] focus:border-[#E06D53] focus:ring-[#E06D53]/30 hover:border-[#D5CBC0]'
            }
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-[#D34538] font-medium ml-1">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-xs text-[#7A7267] ml-1">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
