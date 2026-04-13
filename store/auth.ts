import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  staff?: {
    id: number;
    first_name: string;
    surname: string;
    designation: string;
    department?: {
        name: string;
    };
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
