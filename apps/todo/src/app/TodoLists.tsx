import { useEffect, useState } from 'react';
import { TodoList as TodoListType } from '@fyltura/types';
import TodoList from './TodoList';

const API_BASE = 'http://localhost:3333/api';
const USER_ID = 1; // Default user ID

export function TodoLists() {
  const [todoLists, setTodoLists] = useState<TodoListType[]>([]);
  const [newListName, setNewListName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all todolists
  const fetchTodoLists = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/todolists?userId=${USER_ID}`);
      if (!response.ok) throw new Error('Failed to fetch todolists');
      const data = await response.json();
      setTodoLists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching todolists:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoLists();
  }, []);

  // Create new todolist
  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/todolists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName.trim(), userId: USER_ID }),
      });
      if (!response.ok) throw new Error('Failed to create todolist');
      await fetchTodoLists();
      setNewListName('');
    } catch (err) {
      console.error('Error creating todolist:', err);
    }
  };

  // Delete todolist
  const handleDeleteList = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/todolists/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todolist');
      await fetchTodoLists();
    } catch (err) {
      console.error('Error deleting todolist:', err);
    }
  };

  // Add todo to list
  const handleAddTodo = async (todolistId: string, name: string) => {
    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, isDone: false, todolistId }),
      });
      if (!response.ok) throw new Error('Failed to create todo');
      await fetchTodoLists();
    } catch (err) {
      console.error('Error creating todo:', err);
    }
  };

  // Toggle todo completion
  const handleToggleTodo = async (id: string) => {
    const todo = todoLists
      .flatMap((list) => list.todos)
      .find((t) => t.id === id);
    if (!todo) return;

    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDone: !todo.isDone }),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      await fetchTodoLists();
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      await fetchTodoLists();
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-2xl text-secondary-dark-bg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark-bg text-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <button
          onClick={fetchTodoLists}
          className="mt-4 px-4 py-2 bg-accent text-black rounded hover:bg-secondary-bg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreateList}
        className="bg-white rounded-lg shadow-lg p-6 border-2 border-secondary-bg"
      >
        <h2 className="text-xl font-bold text-dark-bg mb-4">Create New List</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter list name..."
            className="flex-1 px-4 py-3 rounded-lg border-2 border-secondary-bg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-base-bg text-dark-bg placeholder-secondary-dark-bg"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-dark-bg hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Create List
          </button>
        </div>
      </form>

      {todoLists.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center border-2 border-secondary-bg">
          <p className="text-xl text-secondary-dark-bg">
            No todo lists yet. Create one above to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {todoLists.map((list) => (
            <TodoList
              key={list.id}
              todoList={list}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
              onDeleteList={handleDeleteList}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoLists;
