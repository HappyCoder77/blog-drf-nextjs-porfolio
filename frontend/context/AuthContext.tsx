import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
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
    if (!decodedToken.username) {
      console.warn("Token does not contain username.");
      return null;
    }
    return { username: decodedToken.username };
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
    {
      if (typeof window !== "undefined") {
        const storedTokens = localStorage.getItem("authTokens");

        if (storedTokens) {
          const parsedTokens = JSON.parse(storedTokens);
          return getUserFromToken(parsedTokens.access);
        }
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
      router.replace("/dashboard");
    } catch (error) {
      console.log("Login failed", error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    router.replace("/login/");
  }, [router]);

  useEffect(() => {
    if (tokens && !user) {
      const loadedUser = getUserFromToken(tokens.access);
      setUser(loadedUser);
    }
  }, [tokens, user]);

  const isAuthenticated = !!user && !!tokens;

  const refreshAccessToken = useCallback(
    async (refreshToken: string): Promise<string> => {
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
    },
    [setTokens, logout]
  );

  useEffect(() => {
    // Variable para almacenar la referencia al interceptor que vamos a crear
    let interceptorId: number | null = null;

    if (tokens) {
      // 1. Establecer el nuevo Access Token en el header por defecto para todas las peticiones
      api.defaults.headers.common["Authorization"] = `Bearer ${tokens.access}`;

      // 2. Configurar el Interceptor para el manejo de 401 (token expirado)
      interceptorId = api.interceptors.response.use(
        (response) => response, // Petición exitosa
        async (error) => {
          const originalRequest = error.config;

          // Si recibimos 401 y no es una petición de reintento
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              // Llamar a la función del contexto para refrescar el token
              const newAccessToken = await refreshAccessToken(tokens.refresh);

              // 💥 Actualizar el header de la petición fallida con el nuevo token
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;

              // Reintentar la petición original con el nuevo token
              return api(originalRequest);
            } catch (err) {
              // Si falla el refresh, forzar el logout
              logout();
              return Promise.reject(err);
            }
          }
          return Promise.reject(error);
        }
      );
    } else {
      // 3. Si no hay tokens (logout), limpiar el header
      delete api.defaults.headers.common["Authorization"];
    }

    // 4. Función de limpieza (se ejecuta al desmontar o cuando 'tokens' cambia)
    return () => {
      // Si existe un interceptor, ¡hay que quitarlo!
      if (interceptorId !== null) {
        api.interceptors.response.eject(interceptorId);
      }
    };
    // 💥 Este useEffect depende de 'tokens', 'refreshAccessToken', y 'logout'
  }, [tokens, refreshAccessToken, logout]);

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
