// --- USER TYPES ---

/**
 * User entity - represents a registered user in the system.
 * This type is safe for frontend consumption (no password/hash).
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User registration request payload.
 */
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

/**
 * User login request payload.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Authentication response - returned after successful login/register.
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Refresh token request payload.
 */
export interface RefreshRequest {
  refreshToken: string;
}

/**
 * User profile update payload - all fields optional.
 * Note: Password changes should use a separate endpoint.
 */
export interface UpdateUser {
  email?: string;
  displayName?: string;
}

// --- JWT TYPES ---

/**
 * JWT token payload structure.
 * Used by backend to encode/decode tokens.
 */
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// --- STATS TYPES ---

/**
 * Period filter for statistics queries.
 */
export type StatsPeriod = 'day' | 'week' | 'month' | 'year';

/**
 * User statistics response for a given period.
 * Based on todo completion status.
 */
export interface UserStats {
  period: StatsPeriod;
  total: number;
  successful: number;
  failed: number;
  pending: number;
  completionRate: number;
}
