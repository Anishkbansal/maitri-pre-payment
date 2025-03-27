import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = isAdminAuthenticated();
  
  if (!isAuthenticated) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute; 