import Tasks from './tasks';

export function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Tasks</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <Tasks/>
        </div>
      </div>
    </div>
  );
}

export default App;
