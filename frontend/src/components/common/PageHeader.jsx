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
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ios-gray-900">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs md:text-sm text-ios-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;
