import { create } from 'zustand';
import { User } from '@shared/types';
import { environment } from '../../environments/environment';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  login: (user, accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    set({ user, accessToken });
  },

  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    set({ user: null, accessToken: null });
  },

  setAccessToken: (token) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    set({ accessToken: token });
  },

  initAuth: async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await fetch(`${environment.apiUrl}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Invalid token');
      const user: User = await res.json();
      set({ user, accessToken: token });
    } catch {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Validate stored token immediately when the module loads
useAuthStore.getState().initAuth();
