"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { User, LoginCredentials, RegisterCredentials } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

type AuthResponse = any;

const resolveUser = (payload: any): User | null => {
  if (!payload) return null;

  if (payload.user) return payload.user;

  return null;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const loadMe = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<AuthResponse>("/auth/me");
        if (isMounted) {
          handleAuthSuccess(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMe();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(resolveUser(data));
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      handleAuthSuccess(response.data);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>(
        "/auth/register",
        credentials,
      );
      handleAuthSuccess(response.data);
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    api.post("/auth/logout").catch(console.error);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
