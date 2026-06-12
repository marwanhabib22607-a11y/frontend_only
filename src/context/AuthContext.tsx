import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMe, UserWithProfile } from "@workspace/api-client-react";

interface AuthContextType {
  user: UserWithProfile | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fix-it-token");
    }
    return null;
  });

  const { data: user, isLoading: isUserLoading, error, refetch } = useGetMe({
    query: {
      enabled: !!token,
      retry: false,
    },
  });

  useEffect(() => {
    if (error) {
      localStorage.removeItem("fix-it-token");
      setToken(null);
      queryClient.clear();
    }
  }, [error]);

  const login = (newToken: string) => {
    localStorage.setItem("fix-it-token", newToken);
    setToken(newToken);
    refetch();
  };

  const logout = () => {
    localStorage.removeItem("fix-it-token");
    setToken(null);
    // Clear ALL React Query cached data so stale user data doesn't linger in the UI
    queryClient.clear();
  };

  // When token is null, immediately treat user as logged out
  // even if React Query hasn't updated yet
  const resolvedUser = token ? (user ?? null) : null;

  return (
    <AuthContext.Provider
      value={{
        user: resolvedUser,
        isLoading: !!token && isUserLoading,
        login,
        logout,
        isAuthenticated: !!resolvedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
