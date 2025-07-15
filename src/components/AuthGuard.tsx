
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Simple component that just renders children without any auth checks
const AuthGuard = ({ children }: AuthGuardProps) => {
  return <>{children}</>;
};

export default AuthGuard;
