export default function TaskForm({
  formData,
  handleChange,
  handleSubmit,
  editingId,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      <input
        name="title"
        placeholder="Task title"
        value={formData.title}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        name="description"
        placeholder="Task description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-3">
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {editingId ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}
