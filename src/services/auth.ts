import { API_URL } from "@/constants/api";
import { localStorageKeys } from "@/constants/localstorage";
import { User } from "@/types";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    createdAt: string;
  };
  token?: string;
}

function validateToken(token: string): { userId: string; exp: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp * 1000 < Date.now()) return null;

    return { userId: payload.userId, exp: payload.exp };
  } catch {
    return null;
  }
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${API_URL}/session/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.erro || "Erro ao fazer login");
    }

    const { usuario, token } = await res.json();

    localStorage.setItem(localStorageKeys.token, token);
    localStorage.setItem(localStorageKeys.user, JSON.stringify(usuario));

    return {
      user: {
        id: usuario.id,
        email: usuario.email,
        username: usuario.username,
        createdAt: usuario.createdAt,
      },
      token,
    };
  },

  register: async (email: string, username: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.erro || "Erro ao registrar");
    }

    const { usuario, token } = await res.json();

    localStorage.setItem(localStorageKeys.token, token);
    localStorage.setItem(localStorageKeys.user, JSON.stringify(usuario));

    return {
      user: {
        id: usuario.id,
        email: usuario.email,
        username: usuario.username,
        createdAt: usuario.createdAt,
      },
      token,
    };
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(localStorageKeys.token);
    localStorage.removeItem(localStorageKeys.user);
  },

  getCurrentUser: (): { user: User; token: string } | null => {
    const token = localStorage.getItem(localStorageKeys.token);
    const userStr = localStorage.getItem(localStorageKeys.user);

    if (!token || !userStr) return null;

    const tokenData = validateToken(token);
    if (!tokenData) {
      localStorage.removeItem(localStorageKeys.token);
      localStorage.removeItem(localStorageKeys.user);
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      return { user, token };
    } catch {
      return null;
    }
  },
};
