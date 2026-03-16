import { useState, FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPasswordSchema } from '@fyltura/types';
import apiClient from '../../lib/apiClient';
import Input from '../elements/Input';
import Button from '../elements/Button';

type FormErrors = {
  password?: string;
  confirmPassword?: string;
  form?: string;
};

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, setIsPending] = useState(false);
  const token = searchParams.get('token');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = {
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const result = resetPasswordSchema.safeParse(values);
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
      await apiClient.post('/auth/reset-password', {
        token,
        password: values.password,
      });
      navigate('/login', {
        state: { message: 'Password updated. You can now sign in.' },
      });
    } catch (err: unknown) {
      setErrors({ form: (err as Error).message });
    } finally {
      setIsPending(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2 border-2 border-secondary-bg rounded-lg focus:outline-none focus:border-accent';

  if (!token) {
    return (
      <div className="min-h-screen bg-base-bg flex items-center justify-center py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg border-2 border-secondary-bg p-8 w-full max-w-md text-center">
          <p className="text-red-600 mb-4">Invalid or missing reset token.</p>
          <Link
            to="/forgot-password"
            className="text-accent font-medium hover:underline text-sm"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-bg flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg border-2 border-secondary-bg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-dark-bg mb-6 text-center">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="password"
              name="password"
              type="password"
              label="New Password"
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
              label="Confirm New Password"
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
            {isPending ? 'Saving…' : 'Set New Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
