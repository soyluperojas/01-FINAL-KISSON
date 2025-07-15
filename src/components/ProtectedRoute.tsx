
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// For public mode - always render children without protection
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;
