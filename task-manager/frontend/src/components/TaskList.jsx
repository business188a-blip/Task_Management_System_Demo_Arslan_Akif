import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";


export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: "",
  });
  const [editingId, setEditingId] = useState(null);

  // UI controls
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((res) => setTasks(res.data))
      .catch(() => toast.error("Error fetching tasks"));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (formData.description && formData.description.length < 5) {
      toast.error("Description must be at least 5 characters");
      return;
    }

    const url = editingId
      ? `http://localhost:5000/api/tasks/${editingId}`
      : "http://localhost:5000/api/tasks";
    const method = editingId ? "put" : "post";

    axios[method](url, formData)
      .then(() => {
        fetchTasks();
        setFormData({
          title: "",
          description: "",
          status: "Pending",
          dueDate: "",
        });
        setEditingId(null);
        toast.success(editingId ? "Task updated!" : "Task added!");
        setCurrentPage(1); // reset to first page after change
      })
      .catch(() => toast.error("Error saving task"));
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status || "Pending",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
    setEditingId(task._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    axios
      .delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        fetchTasks();
        toast.success("Task deleted!");
      })
      .catch(() => toast.error("Error deleting task"));
  };

  // Combine filters, search, sort
  const displayedTasks = tasks
    .filter((task) => (filter ? task.status === filter : true))
    .filter((task) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      const title = (task.title || "").toLowerCase();
      const desc = (task.description || "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return da - db;
      }
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(displayedTasks.length / tasksPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const indexOfLastTask = safePage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = displayedTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
   <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10">
  <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">

      <h2 className="text-2xl font-bold mb-4">
        {editingId ? "Edit Task" : "Create Task"}
      </h2>

      {/* Task Form */}
      <TaskForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editingId={editingId}
      />

      {/* Search, Filter, Sort */}
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full"
        />

        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            onClick={() => setSortBy(sortBy === "dueDate" ? "" : "dueDate")}
            className="bg-gray-600 text-white px-3 py-1 rounded"
          >
            {sortBy === "dueDate" ? "Clear Sort" : "Sort by Due Date"}
          </button>
        </div>
      </div>

      {/* Task List */}
      <h2 className="text-xl font-bold mb-2">Tasks</h2>
      {currentTasks.length === 0 ? (
        <p className="text-gray-600">No tasks found.</p>
      ) : (
        <ul className="space-y-2">
          {currentTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={safePage === 1}
          className={`px-3 py-1 rounded ${
            safePage === 1 ? "bg-gray-200 text-gray-500" : "bg-gray-600 text-white"
          }`}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              safePage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={safePage === totalPages}
          className={`px-3 py-1 rounded ${
            safePage === totalPages ? "bg-gray-200 text-gray-500" : "bg-gray-600 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  </div>
);
}
