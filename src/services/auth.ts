export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    createdAt: string;
  };
  token?: string;
}

const API_URL = "http://localhost:3001";

// Generate mock JWT token
function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      userId,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24h
    })
  );
  const signature = btoa(`mock_signature_${userId}`);
  return `${header}.${payload}.${signature}`;
}

function validateToken(token: string): { userId: string; exp: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null;

    return { userId: payload.userId, exp: payload.exp };
  } catch {
    return null;
  }
}

export const authService = {
  // Login real via backend
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

    const { usuario } = await res.json();

    const token = generateToken(usuario.id);
    localStorage.setItem("mtg_app_token", token);
    localStorage.setItem("mtg_app_user", JSON.stringify(usuario));

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

  // Registro real via backend
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

    const novoUsuario = await res.json();

    const token = generateToken(novoUsuario.id);
    localStorage.setItem("mtg_app_token", token);
    localStorage.setItem("mtg_app_user", JSON.stringify(novoUsuario));

    return {
      user: {
        id: novoUsuario.id,
        email: novoUsuario.email,
        username: novoUsuario.username,
        createdAt: novoUsuario.createdAt,
      },
      token,
    };
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("mtg_app_token");
    localStorage.removeItem("mtg_app_user");
  },

  getCurrentUser: (): { user: any; token: string } | null => {
    const token = localStorage.getItem("mtg_app_token");
    const userStr = localStorage.getItem("mtg_app_user");

    if (!token || !userStr) return null;

    const tokenData = validateToken(token);
    if (!tokenData) {
      localStorage.removeItem("mtg_app_token");
      localStorage.removeItem("mtg_app_user");
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      return { user, token };
    } catch {
      return null;
    }
  },

  validateSession: (): boolean => {
    const token = localStorage.getItem("mtg_app_token");
    if (!token) return false;

    const tokenData = validateToken(token);
    return tokenData !== null;
  },
};
