import React from 'react';

const PageHeader = ({
  title,
  subtitle,
  badge,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 ${className}`}>
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#18181B]">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#6E6A63] mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;
