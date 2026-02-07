import { useParams } from 'react-router-dom';
import Container from './component/elements/Container';
import Header from './component/elements/Header';
import Dropdown from './component/elements/Dropdown';
import TodoContainer from './component/todo/todoContainer';
import ErrorFallback from './component/elements/ErrorFallback';

function App() {
  const { userId } = useParams<{ userId: string }>();
  const parsedUserId = userId ? parseInt(userId) : undefined;

  // Dummy user data for demonstration
  const users = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
    { id: '4', name: 'David' },
    { id: '5', name: 'Eve' },
  ];

  const existedUser = users.find((user) => user.id === userId);

  return (
    <div className="min-h-screen bg-base-bg py-8">
      <main className="max-w-6xl mx-auto px-4">
        <Header />
        <Container className="space-y-6">
          <Dropdown users={users} />
          {!existedUser && (
            <ErrorFallback error={new Error('User not found')} />
          )}
          {parsedUserId && users.some((user) => user.id === userId) && (
            <TodoContainer userId={parsedUserId} />
          )}
        </Container>
      </main>
    </div>
  );
}

export default App;
