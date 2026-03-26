import Container from './component/elements/Container';
import Layout from './component/elements/Layout';
import TodoContainer from './component/todo/todoContainer';
import { useAuthStore } from './store/authStore';

function App() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <Layout>
      <Container className="space-y-6">
        <TodoContainer />
      </Container>
    </Layout>
  );
}

export default App;
