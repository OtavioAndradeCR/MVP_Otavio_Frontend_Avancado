import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (name: string, email: string, password: string, phone: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Provedor de contexto de autenticação de usuários normais
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se já está autenticado ao montar
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userData");
    if (userToken && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
      }
    }
    setIsLoading(false);
  }, []);

  const register = (name: string, email: string, password: string, phone: string): boolean => {
    // Verifica se usuário já existe
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u: any) => u.email === email)) {
      return false; // Email já cadastrado
    }

    // Cria novo usuário
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      address: "",
      createdAt: new Date().toISOString(),
    };

    // Salva usuário na lista de credenciais
    users.push({
      email,
      password: btoa(password), // Simples hash (não é seguro em produção)
    });
    localStorage.setItem("users", JSON.stringify(users));

    // Salva dados do usuário
    const allUsersData = JSON.parse(localStorage.getItem("allUsersData") || "[]");
    allUsersData.push(newUser);
    localStorage.setItem("allUsersData", JSON.stringify(allUsersData));

    // Faz login automático
    localStorage.setItem("userToken", btoa(`${email}:${password}`));
    localStorage.setItem("userData", JSON.stringify(newUser));
    setUser(newUser);

    return true;
  };

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userRecord = users.find((u: any) => u.email === email);

    if (userRecord && userRecord.password === btoa(password)) {
      // Busca dados do usuário armazenado
      const allUsersData = JSON.parse(localStorage.getItem("allUsersData") || "[]");
      const userData = allUsersData.find((u: any) => u.email === email);
      
      const user: User = userData || {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
        phone: "",
        address: "",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("userToken", btoa(`${email}:${password}`));
      localStorage.setItem("userData", JSON.stringify(user));
      setUser(user);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem("userData", JSON.stringify(updated));
    }
  };

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, register, login, logout, updateProfile }}
    >
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook para usar o contexto de autenticação de usuários
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser deve ser usado dentro de UserProvider");
  }
  return context;
}
