import { z } from 'zod';
import { PASSWORD_REGEX, PASSWORD_REQUIREMENTS } from './validation';

const passwordField = z.string().refine((val) => PASSWORD_REGEX.test(val), {
  message: PASSWORD_REQUIREMENTS,
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    username: z.string().min(2, 'Username must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: passwordField,
    confirmPassword: z.string(),
    agreeToTerms: z.literal(true, {
      error: () => ({ message: 'You must agree to the terms' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
