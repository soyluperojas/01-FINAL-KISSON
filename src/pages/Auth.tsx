
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();

  // For public exhibition mode - redirect everyone to main page
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  // This component will redirect immediately, so no need for UI
  return null;
};

export default Auth;
