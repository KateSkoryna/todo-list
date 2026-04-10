import { StrictMode, ReactElement, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import App from './app/app';
import StatisticsPage from './app/component/statistics/StatisticsPage';
import LoginPage from './app/component/auth/LoginPage';
import RegisterPage from './app/component/auth/RegisterPage';
import ForgotPasswordPage from './app/component/auth/ForgotPasswordPage';
import { useAuthStore } from './app/store/authStore';
import Loader from './app/component/elements/Loader';
import { auth } from './app/lib/firebase';
import apiClient from './app/lib/apiClient';

const queryClient = new QueryClient();

function AuthBootstrap({ children }: { children: ReactElement }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const { data } = await apiClient.get('/auth/user');
          setUser(data);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);

  return children;
}

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
        <AuthBootstrap>
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
            <Route
              path="/statistics"
              element={
                <AuthRoute requireAuth>
                  <StatisticsPage />
                </AuthRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthBootstrap>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
