import TaskList from "./components/TaskList";



export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Task Manager</h1>
      <TaskList />
    </div>
  );
}
