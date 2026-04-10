import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Input from '../elements/Input';
import Button from '../elements/Button';

function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    setIsPending(true);
    try {
      await sendPasswordResetEmail(auth, formData.get('email') as string);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-bg flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg border-2 border-secondary-bg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-dark-bg mb-2 text-center">
          Forgot Password
        </h1>

        {submitted ? (
          <div className="text-center space-y-4">
            <p className="text-dark-bg">
              If that email exists, a reset link has been sent. Check your
              inbox.
            </p>
            <Link
              to="/login"
              className="text-accent font-medium hover:underline text-sm"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className="text-secondary-dark-bg text-sm mb-6 text-center">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full py-2 bg-dark-bg text-white rounded-lg hover:bg-secondary-dark-bg disabled:opacity-50 font-medium"
              >
                {isPending ? 'Sending…' : 'Send Reset Link'}
              </Button>
            </form>

            <p className="mt-4 text-center text-dark-bg text-sm">
              <Link
                to="/login"
                className="text-accent font-medium hover:underline"
              >
                Back to Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
