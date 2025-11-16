import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/AuthService';
import type { User } from '@/services/AuthService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    // First check for stored auth state
    authService.checkStoredAuth().then((storedAuthState) => {
      if (storedAuthState) {
        setState({
          isAuthenticated: true,
          isLoading: false,
          user: storedAuthState.user,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    });

    // Then listen for changes
    const unsubscribe = authService.addListener((authState) => {
      setState({
        isAuthenticated: authState.isAuthenticated,
        isLoading: false,
        user: authState.user,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
