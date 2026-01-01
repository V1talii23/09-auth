'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { useEffect } from 'react';
import { getMe, checkSession } from '@/lib/api/clientApi';

interface AuthProvider {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProvider) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    const getUser = async () => {
      const isAuthenticated = await checkSession();

      if (isAuthenticated) {
        const user = await getMe();

        if (user) {
          setUser(user);
        }
        clearIsAuthenticated();
      }
    };

    getUser();
  }, [setUser, clearIsAuthenticated]);

  return children;
}
export default AuthProvider;
