import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { provisionUserFetcher } from '../../fetchers/auth';
import { registerSchema } from '@shared/types';
import { User, AtSign, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import manImage from '../../../assets/man.webp';
import Checkbox from '../elements/Checkbox';
import AuthLayout from './AuthLayout';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

type FormErrors = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  form?: string;
};

function RegisterPage() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      agreeToTerms: agreeToTerms as true,
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
      const credential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      await updateProfile(credential.user, {
        displayName: `${values.firstName} ${values.lastName}`,
      });
      const user = await provisionUserFetcher(
        values.firstName,
        values.lastName,
        values.username
      );
      setUser(user);
      navigate('/');
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrors({});
    setIsPending(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const { displayName, email } = credential.user;
      const firstName = displayName?.split(' ')[0] ?? '';
      const lastName = displayName?.split(' ').slice(1).join(' ') ?? '';
      const username = (email ?? '').split('@')[0];
      const user = await provisionUserFetcher(firstName, lastName, username);
      setUser(user);
      navigate('/');
    } catch {
      setErrors({ form: 'Google sign-up failed. Please try again.' });
    } finally {
      setIsPending(false);
    }
  };

  const inputClass =
    'w-full pl-9 pr-4 py-3 border border-secondary-bg rounded-lg focus:outline-none focus:border-dark-bg text-dark-bg placeholder:text-secondary-dark-bg';
  const passwordInputClass =
    'w-full pl-9 pr-9 py-3 border border-secondary-bg rounded-lg focus:outline-none focus:border-dark-bg text-dark-bg placeholder:text-secondary-dark-bg';

  const illustration = (
    <div className="hidden md:flex w-1/2 bg-white items-center justify-center overflow-hidden">
      <img
        src={manImage}
        alt="Man with documents illustration"
        className="object-contain h-2/3 w-2/3"
      />
    </div>
  );

  return (
    <AuthLayout illustration={illustration}>
      {/* Form */}
      <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-dark-bg mb-6">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-dark-bg" />
                <input
                  name="firstName"
                  type="text"
                  placeholder="Enter First Name"
                  required
                  className={inputClass}
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-dark-bg" />
                <input
                  name="lastName"
                  type="text"
                  placeholder="Enter Last Name"
                  required
                  className={inputClass}
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-dark-bg" />
            <input
              name="username"
              type="text"
              placeholder="Enter Username"
              required
              className={inputClass}
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-xs -mt-2">{errors.username}</p>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-dark-bg" />
            <input
              name="email"
              type="email"
              placeholder="Enter Email"
              required
              className={inputClass}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs -mt-2">{errors.email}</p>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-dark-bg" />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Enter Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordInputClass}
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-dark-bg hover:text-dark-bg"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs -mt-2">{errors.password}</p>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-dark-bg" />
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={passwordInputClass}
            />
            {confirmPassword && (
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-dark-bg hover:text-dark-bg"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs -mt-2">
              {errors.confirmPassword}
            </p>
          )}

          <Checkbox
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={setAgreeToTerms}
            label="I agree to all terms and conditions"
          />
          {errors.agreeToTerms && (
            <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>
          )}

          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-accent text-dark-bg font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isPending ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3 border border-secondary-bg rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm text-dark-bg font-medium"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>

        <p className="mt-4 text-sm text-secondary-dark-bg">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-triadic-blue font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
