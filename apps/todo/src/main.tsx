import { StrictMode, ReactElement } from 'react';
import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import App from './app/app';
import LoginPage from './app/component/auth/LoginPage';
import RegisterPage from './app/component/auth/RegisterPage';
import ForgotPasswordPage from './app/component/auth/ForgotPasswordPage';
import ResetPasswordPage from './app/component/auth/ResetPasswordPage';
import { useAuthStore } from './app/store/authStore';
import Loader from './app/component/elements/Loader';

const queryClient = new QueryClient();

function AuthRoute({
  children,
  requireAuth,
}: {
  children: ReactElement;
  requireAuth: boolean;
}) {
  const isAuthenticated = useAuthStore((s) => !!s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return <Loader message="Loading…" />;
  if (requireAuth && !isAuthenticated) return <Navigate to="/login" replace />;
  if (!requireAuth && isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthRoute requireAuth>
                <App />
              </AuthRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRoute requireAuth={false}>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute requireAuth={false}>
                <RegisterPage />
              </AuthRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
