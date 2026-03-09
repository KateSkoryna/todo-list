// --- USER TYPES ---
export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUser {
  email: string;
  password: string;
  displayName: string;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}

// --- AUTH TYPES ---
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// --- STATS TYPES ---
export type StatsPeriod = 'day' | 'week' | 'month' | 'year';

export interface UserStats {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  completionRate: number;
}

export interface StatsResponse extends UserStats {
  period: StatsPeriod;
}
