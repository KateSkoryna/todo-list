import TodoLists from './component/TodoLists';
import TodoListForm from './component/TodoListForm';
import { useTodoListsData } from './hooks/useTodoListsData';
import Container from './component/Container';
import Header from './component/Header';

function App() {
  const {
    todoLists,
    isLoading,
    isError,
    error,
    refetch,
    handleCreateList,
    handleDeleteList,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    createListMutationIsPending,
  } = useTodoListsData();

  return (
    <div className="min-h-screen bg-base-bg py-8">
      <main className="max-w-6xl mx-auto px-4">
        <Header />
        <Container className="space-y-6">
          <TodoListForm
            onSubmit={handleCreateList}
            isSubmitting={createListMutationIsPending}
          />

          <TodoLists
            todoLists={todoLists}
            isLoading={isLoading}
            isError={isError}
            error={error}
            refetch={refetch}
            handleDeleteList={handleDeleteList}
            handleAddTodo={handleAddTodo}
            handleToggleTodo={handleToggleTodo}
            handleDeleteTodo={handleDeleteTodo}
          />
        </Container>
      </main>
    </div>
  );
}

export default App;
