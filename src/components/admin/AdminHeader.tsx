import React from 'react';

interface AdminHeaderProps {
  title: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="h-1 w-20 bg-yellow-500 mt-2"></div>
    </div>
  );
};

export default AdminHeader; 