import { useParams, useNavigate } from 'react-router-dom';
import Container from './component/elements/Container';
import Header from './component/elements/Header';
import Dropdown from './component/elements/Dropdown';
import TodoContainer from './component/todo/todoContainer';
import { useEffect, useMemo } from 'react';

function App() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // Dummy user data for demonstration
  const users = useMemo(
    () => [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' },
      { id: '4', name: 'David' },
      { id: '5', name: 'Eve' },
    ],
    []
  );
  const user = users.find((u) => u.id === userId);
  const parsedUserId = userId ? parseInt(userId) : undefined;

  useEffect(() => {
    if (!userId && !user) {
      navigate(`/users/${users[0].id}`);
    }
  }, [userId, users, navigate, user]);

  return (
    <div className="min-h-screen bg-base-bg py-8">
      <main className="max-w-6xl mx-auto px-4">
        <Header />
        <Container className="space-y-6">
          <Dropdown users={users} />
          {parsedUserId && users.some((user) => user.id === userId) && (
            <TodoContainer userId={parsedUserId} />
          )}
        </Container>
      </main>
    </div>
  );
}

export default App;
