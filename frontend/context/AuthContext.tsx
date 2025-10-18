import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { api } from "../utils/api";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

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

export interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshAccessToken: (refreshToken: string) => Promise<string>;
}

interface JWTPayload {
  user_id?: number; // O id, dependiendo de tu backend
  username?: string;
  exp: number; // Expiración (timestamp)
  iat: number; // Emitido en (timestamp)
  // Puedes añadir más campos si los usas
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getUserFromToken = (token: string): User | null => {
  try {
    const decodedToken: JWTPayload = jwtDecode(token);
    return { username: decodedToken.username || "Usuario desconocido" };
  } catch (error) {
    console.log("Error on decoding token:", error);
    return null;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedTokens = localStorage.getItem("authTokens");

      if (storedTokens) {
        const parsedTokens = JSON.parse(storedTokens);
        return getUserFromToken(parsedTokens.access);
      }
    }

    return null;
  });

  const [tokens, setTokens] = useState<AuthTokens | null>(() => {
    if (typeof window !== "undefined") {
      const storedTokens = localStorage.getItem("authTokens");
      return storedTokens ? JSON.parse(storedTokens) : null;
    }

    return null;
  });

  const router = useRouter();

  const login = async (credentials: Credentials) => {
    try {
      const response = await api.post("/token/", credentials);
      const newTokens: AuthTokens = response.data;

      setTokens(newTokens);
      localStorage.setItem("authTokens", JSON.stringify(newTokens));

      const loggedInUser = getUserFromToken(newTokens.access);
      setUser(loggedInUser);
      router.push("/dashboard");
    } catch (error) {
      console.log("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    router.push("/login");
  };

  useEffect(() => {
    if (tokens && !user) {
      const loadedUser = getUserFromToken(tokens.access);
      setUser(loadedUser);
    }
  }, [tokens, user]);

  const isAuthenticated = !!user && !!tokens;

  const refreshAccessToken = async (refreshToken: string): Promise<string> => {
    try {
      const response = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });

      const newAccess: string = response.data.access;
      setTokens((prev) => {
        if (!prev) return null;
        const newTokens = { ...prev, access: newAccess };
        localStorage.setItem("authTokens", JSON.stringify(newTokens));
        return newTokens;
      });

      return newAccess;
    } catch (error) {
      console.error("Error al refrescar el token:", error);
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        login,
        logout,
        isAuthenticated,
        refreshAccessToken,
      }}
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
