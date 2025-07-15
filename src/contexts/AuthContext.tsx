import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SecurityAuditLogger } from '@/utils/securityAudit';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // For public mode - always return null user but keep the structure
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false); // Set to false for public mode

  useEffect(() => {
    // For public mode, we don't need to check sessions
    // But we keep the structure for compatibility
    setLoading(false);
  }, []);

  // Stub functions for public mode
  const signUp = async (email: string, password: string): Promise<{ error?: any }> => {
    console.log("Sign up disabled in public mode");
    return { error: { message: "Authentication disabled in public mode" } };
  };

  const signIn = async (email: string, password: string): Promise<{ error?: any }> => {
    console.log("Sign in disabled in public mode");
    return { error: { message: "Authentication disabled in public mode" } };
  };

  const signOut = async (): Promise<void> => {
    console.log("Sign out disabled in public mode");
  };

  const resetPassword = async (email: string): Promise<void> => {
    console.log("Password reset disabled in public mode");
  };

  const value: AuthContextType = {
    user: null, // Always null in public mode
    session: null, // Always null in public mode
    loading: false, // Always false in public mode
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
