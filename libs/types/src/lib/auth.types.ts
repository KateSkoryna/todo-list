// --- USER TYPES ---

/**
 * User entity - represents a registered user in the system.
 * This type is safe for frontend consumption (no password/hash).
 */
export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  username?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User registration request payload (collected from form, sent to /auth/provision).
 */
export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
}

/**
 * User profile update payload - all fields optional.
 */
export interface UpdateUser {
  email?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
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
  total: number;
  successful: number;
  failed: number;
  pending: number;
  completionRate: number;
}
