import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextType, User } from "../types";
import { authService } from "../services/auth";
import { toast } from "../hooks/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const session = authService.getCurrentUser();
    if (session) {
      setUser(session.user);
      setToken(session.token);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user);
      setToken(response.token);
      toast({
        title: "Conectado(a)",
        description: `Bem vindo(a) de volta, ${response.user.username}!`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tente Novamente';
      toast({
        title: "Login Falhou!",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.register(email, username, password);
      setUser(response.user);
      setToken(response.token);
      toast({
        title: "Registrado com Sucesso!",
        description: `Bem vindo(a) ao MTG Deck Builder, ${response.user.username}!`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'O usuário não foi registrado';
      toast({
        title: "Registro Falhou!",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      toast({
        title: "Desconectado(a)",
        description: "Até a próxima...",
      });
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
