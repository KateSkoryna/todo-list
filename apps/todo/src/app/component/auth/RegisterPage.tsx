import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { registerFetcher } from '../../fetchers/auth';
import { registerSchema } from '@fyltura/types';
import Input from '../elements/Input';
import Button from '../elements/Button';

function RegisterPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  type FormErrors = {
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  };
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = {
      displayName: formData.get('displayName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const result = registerSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsPending(true);
    try {
      const { user, accessToken, refreshToken } = await registerFetcher(
        values.email,
        values.password,
        values.displayName
      );
      login(user, accessToken, refreshToken);
      navigate('/');
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setIsPending(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2 border-2 border-secondary-bg rounded-lg focus:outline-none focus:border-accent';

  return (
    <div className="min-h-screen bg-base-bg flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg border-2 border-secondary-bg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-dark-bg mb-6 text-center">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              label="Display Name"
              placeholder="Your name"
              className={inputClass}
            />
            {errors.displayName && (
              <p className="text-red-600 text-sm mt-1">{errors.displayName}</p>
            )}
          </div>
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              className={inputClass}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              className={inputClass}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              className={inputClass}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.form && <p className="text-red-600 text-sm">{errors.form}</p>}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-2 bg-dark-bg text-white rounded-lg hover:bg-secondary-dark-bg disabled:opacity-50 font-medium"
          >
            {isPending ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-4 text-center text-dark-bg text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-black hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
