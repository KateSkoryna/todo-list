import TodoLists from './TodoLists';

export function App() {
  return (
    <div className="min-h-screen bg-base-bg py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-dark-bg mb-2">
            Todo Lists
          </h1>
          <p className="text-secondary-dark-bg text-lg">
            Organize your tasks efficiently
          </p>
        </header>
        <TodoLists />
      </div>
    </div>
  );
}

export default App;
