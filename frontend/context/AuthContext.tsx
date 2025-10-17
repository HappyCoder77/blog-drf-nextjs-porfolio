import React, { createContext, useContext, useState, ReactNode } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/navigation";

interface AuthTokens {
  access: string;
  refresh: string;
}

interface User {
  username: string;
}

interface Credentials {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const router = useRouter();

  const login = async (credentials: Credentials) => {
    try {
      const response = await api.post("/token/", credentials);
      const newTokens: AuthTokens = response.data;

      setTokens(newTokens);
      setUser({ username: credentials.username });
      router.push("/dashboard");
    } catch (error) {
      console.log("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    setTokens(null);
    setUser(null);
    router.push("/login");
  };

  const isAuthenticated = !!user && !!tokens;

  return (
    <AuthContext.Provider
      value={{ user, tokens, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used  within an AuthProvider.");
  }

  return context;
};
