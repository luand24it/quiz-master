import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
    <p className="text-slate-500 animate-pulse">Đang nhờ AI soạn đề thi...</p>
  </div>
);