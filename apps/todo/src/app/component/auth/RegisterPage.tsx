import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { registerFetcher } from '../../fetchers/auth';
import Input from '../elements/Input';
import Button from '../elements/Button';

function RegisterPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    setIsPending(true);
    try {
      const { user, accessToken, refreshToken } = await registerFetcher(
        formData.get('email') as string,
        formData.get('password') as string,
        formData.get('displayName') as string
      );
      login(user, accessToken, refreshToken);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsPending(false);
    }
  };

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
              className="w-full px-4 py-2 border-2 border-secondary-bg rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border-2 border-secondary-bg rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border-2 border-secondary-bg rounded-lg focus:outline-none focus:border-accent"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

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
          <Link to="/login" className="text-accent font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
