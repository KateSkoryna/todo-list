import { z } from 'zod';
import { PASSWORD_REGEX, PASSWORD_REQUIREMENTS } from './validation';

const passwordField = z
  .string()
  .refine((val) => PASSWORD_REGEX.test(val), {
    message: PASSWORD_REQUIREMENTS,
  });

export const registerSchema = z
  .object({
    displayName: z.string().min(1, 'Display name is required'),
    email: z.string().email('Invalid email address'),
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
