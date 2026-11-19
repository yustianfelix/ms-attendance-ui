"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { getProfile } from "./api/employee/employee";
import { login as loginApi } from "./api/auth/auth";
import {
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  setAuthSession,
} from "./api/session";
import type { EmployeeProfile } from "./api/employee/dto";

interface AuthContextType {
  user: EmployeeProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user: EmployeeProfile }>;
  logout: () => void;
  refreshProfile: () => Promise<EmployeeProfile | null>;
  updateUser: (updated: Partial<EmployeeProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EmployeeProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getStoredUser());
    setToken(getStoredToken());
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
    setToken(null);
    router.push("/login");
  }, [router]);

  const refreshProfile = useCallback(async (): Promise<EmployeeProfile | null> => {
    const currentToken = getStoredToken();
    const currentUser = getStoredUser();
    if (!currentToken || !currentUser?.employeeId) return null;

    try {
      const freshProfile = await getProfile(currentUser.employeeId);
      const mergedUser = { ...currentUser, ...freshProfile };
      setUser(mergedUser);
      setAuthSession(currentToken, mergedUser);
      return mergedUser;
    } catch (err) {
      console.error("Failed to refresh profile:", err);
      return null;
    }
  }, []);

  const employeeId = user?.employeeId;

  // Background profile sync
  useEffect(() => {
    if (token && employeeId) {
      getProfile(employeeId)
        .then((fresh) => {
          setUser((prev) => {
            if (!prev) return null;
            const merged = { ...prev, ...fresh };
            setAuthSession(token, merged);
            return merged;
          });
        })
        .catch((err) => {
          console.warn("Session verification warning:", err);
        });
    }
  }, [token, employeeId]);

  // Protect client routes
  useEffect(() => {
    if (isLoading) return;
    const isAuthRoute = pathname === "/login";
    if (!token && !isAuthRoute) {
      router.push("/login");
    } else if (token && isAuthRoute) {
      router.push("/dashboard");
    }
  }, [token, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await loginApi({ email, password });
      setToken(result.token);
      setUser(result.user);
      return { success: true, user: result.user };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updated: Partial<EmployeeProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const nextUser = { ...prev, ...updated };
      const currentToken = getStoredToken();
      if (currentToken) {
        setAuthSession(currentToken, nextUser);
      }
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        refreshProfile,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
