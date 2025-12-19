import { useState, useEffect } from "react";

/**
 * Credenciais padrão do admin
 */
const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123",
};

/**
 * Hook customizado para autenticação de admin
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se já está autenticado ao montar
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      const token = btoa(`${username}:${password}`);
      localStorage.setItem("adminToken", token);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
