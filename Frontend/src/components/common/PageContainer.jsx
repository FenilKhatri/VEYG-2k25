import React from 'react';

const PageContainer = ({ children, className = '' }) => (
  <div className={`min-h-screen bg-slate-900`}>
    <div className="w-full lg:w-[90%] xl:w-[85%] 2xl:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </div>
);

export default PageContainer;
