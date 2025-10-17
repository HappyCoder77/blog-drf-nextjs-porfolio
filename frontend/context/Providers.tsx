"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";

interface ProviderProps {
  children: ReactNode;
}

export default function Providers({ children }: ProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
