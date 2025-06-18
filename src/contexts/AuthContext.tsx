
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextType, User } from '../types';
import { authService } from '../services/auth';
import { toast } from '../hooks/use-toast';

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
        title: "Login successful",
        description: `Welcome back, ${response.user.username}!`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast({
        title: "Login failed",
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
        title: "Registration successful",
        description: `Welcome to MTG Deck Builder, ${response.user.username}!`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      toast({
        title: "Registration failed",
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
        title: "Logout successful",
        description: "See you next time!",
      });
    } catch (error) {
      console.error('Logout error:', error);
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
