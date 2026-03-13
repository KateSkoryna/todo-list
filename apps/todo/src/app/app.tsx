import { useNavigate } from 'react-router-dom';
import Container from './component/elements/Container';
import Header from './component/elements/Header';
import TodoContainer from './component/todo/todoContainer';
import Button from './component/elements/Button';
import { useAuthStore } from './store/authStore';

function App() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-base-bg py-8">
      <main className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-2">
          <Header />
          <div className="flex flex-col items-end gap-1">
            <span className="text-dark-bg text-sm">{user.displayName}</span>
            <Button
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-dark-bg text-white rounded hover:bg-secondary-dark-bg"
            >
              Logout
            </Button>
          </div>
        </div>
        <Container className="space-y-6">
          <TodoContainer />
        </Container>
      </main>
    </div>
  );
}

export default App;
