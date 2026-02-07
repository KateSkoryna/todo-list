import { useParams, useNavigate } from 'react-router-dom';
import Container from './component/elements/Container';
import Header from './component/elements/Header';
import Dropdown from './component/elements/Dropdown';
import TodoContainer from './component/todo/todoContainer';

function App() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const parsedUserId = userId ? parseInt(userId) : undefined;

  // Dummy user data for demonstration
  const users = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

  return (
    <div className="min-h-screen bg-base-bg py-8">
      <main className="max-w-6xl mx-auto px-4">
        <Header />
        <Container className="space-y-6">
          <Dropdown
            users={users}
            onSelectUser={(id) => navigate(`/users/${id}`)}
          />
          {parsedUserId && <TodoContainer userId={parsedUserId} />}
        </Container>
      </main>
    </div>
  );
}

export default App;
