
// Mock authentication service
// In a real app, this would connect to your backend

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    createdAt: string;
  };
  token: string;
}

// Mock users storage
const MOCK_USERS_KEY = 'mtg_app_users';
const MOCK_SESSIONS_KEY = 'mtg_app_sessions';

// Get users from localStorage
function getUsers(): any[] {
  const users = localStorage.getItem(MOCK_USERS_KEY);
  return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users: any[]): void {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

// Generate mock JWT token
function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }));
  const signature = btoa(`mock_signature_${userId}`);
  
  return `${header}.${payload}.${signature}`;
}

// Validate token
function validateToken(token: string): { userId: string; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null;
    
    return { userId: payload.userId, exp: payload.exp };
  } catch {
    return null;
  }
}

export const authService = {
  // Login user
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Simple password check (in real app, use proper hashing)
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    const token = generateToken(user.id);
    
    // Store session
    localStorage.setItem('mtg_app_token', token);
    localStorage.setItem('mtg_app_user', JSON.stringify({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt
    }));
    
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      },
      token
    };
  },

  // Register user
  register: async (email: string, username: string, password: string): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    if (users.find(u => u.username === username)) {
      throw new Error('Username already taken');
    }
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      username,
      password, // In real app, hash this!
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    const token = generateToken(newUser.id);
    
    // Store session
    localStorage.setItem('mtg_app_token', token);
    localStorage.setItem('mtg_app_user', JSON.stringify({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      createdAt: newUser.createdAt
    }));
    
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        createdAt: newUser.createdAt
      },
      token
    };
  },

  // Logout user
  logout: async (): Promise<void> => {
    localStorage.removeItem('mtg_app_token');
    localStorage.removeItem('mtg_app_user');
  },

  // Get current user from token
  getCurrentUser: (): { user: any; token: string } | null => {
    const token = localStorage.getItem('mtg_app_token');
    const userStr = localStorage.getItem('mtg_app_user');
    
    if (!token || !userStr) return null;
    
    const tokenData = validateToken(token);
    if (!tokenData) {
      // Token expired, clear storage
      localStorage.removeItem('mtg_app_token');
      localStorage.removeItem('mtg_app_user');
      return null;
    }
    
    try {
      const user = JSON.parse(userStr);
      return { user, token };
    } catch {
      return null;
    }
  },

  // Validate current session
  validateSession: (): boolean => {
    const token = localStorage.getItem('mtg_app_token');
    if (!token) return false;
    
    const tokenData = validateToken(token);
    return tokenData !== null;
  }
};
