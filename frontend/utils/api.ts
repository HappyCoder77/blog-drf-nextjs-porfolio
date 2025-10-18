// frontend/utils/api.ts

import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { AuthContextType } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env.local");
}

// 1. Cliente Básico (Para login/refresh token)
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Cliente Protegido (Para peticiones que requieren token)
export const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variables de control de Refresh Token para prevenir bucles infinitos
let isRefreshing = false;
let failedQueue: {
  resolve: (value: AxiosResponse) => void;
  reject: (error: Error) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

// Función para procesar la cola de peticiones fallidas
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      // Si hay un nuevo token, lo inyectamos en la petición original y la resolvemos
      prom.config.headers.Authorization = `Bearer ${token}`;
      authApi(prom.config).then(prom.resolve).catch(prom.reject);
    }
  });
  failedQueue = [];
};

// 3. Función de Configuración del Interceptor (Llamada una sola vez)
export const setupAuthInterceptors = (authData: AuthContextType) => {
  // --- INTERCEPTOR DE SOLICITUD (REQUEST) ---
  authApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // 1. Inyectar el Access Token antes de cada petición protegida
    const tokens = authData.tokens;
    if (tokens) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  });

  // --- INTERCEPTOR DE RESPUESTA (RESPONSE) ---
  authApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 1. Es un error 401 (Unauthorized) y no estamos ya intentando el refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        // 2. Si ya hay un proceso de refresh en curso, encolamos la petición
        if (isRefreshing) {
          return new Promise<AxiosResponse>((resolve, reject) => {
            failedQueue.push({
              resolve: resolve as (value: AxiosResponse) => void,
              reject,
              config: originalRequest,
            });
          });
        }

        // 3. Iniciar el proceso de refresh
        originalRequest._retry = true; // Marca la petición como reintentada
        isRefreshing = true;

        const tokens = authData.tokens;
        if (!tokens || !tokens.refresh) {
          authData.logout(); // No hay token de refresh, forzar logout
          return Promise.reject(error);
        }

        try {
          // 4. Llamar a la función del Contexto para obtener nuevo token
          const newAccessToken = await authData.refreshAccessToken(
            tokens.refresh
          );

          // 5. Actualizar el token en la petición original y reintentarla
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // 6. Procesar la cola y resolver todas las peticiones en espera
          processQueue(null, newAccessToken);
          isRefreshing = false;

          return authApi(originalRequest); // Reintentar la petición original
        } catch (refreshError) {
          // 7. Si el refresh falla (refresh token expirado), forzar logout
          processQueue(refreshError as Error | null);
          isRefreshing = false;
          authData.logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
