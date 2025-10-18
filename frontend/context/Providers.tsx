"use client";

import { ReactNode, useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { setupAuthInterceptors } from "../utils/api";

interface ProviderProps {
  children: ReactNode;
}

const AuthConfig = () => {
  const authData = useAuth();

  useEffect(() => {
    setupAuthInterceptors(authData);

    return () => {};
  }, [authData]);

  return null;
};

export default function Providers({ children }: ProviderProps) {
  return (
    <AuthProvider>
      <AuthConfig />
      {children}
    </AuthProvider>
  );
}
