export default function TaskForm({
  formData,
  handleChange,
  handleSubmit,
  editingId,
  handleFileChange,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      <input
        name="title"
        placeholder="Task title"
        value={formData.title}
        onChange={handleChange}
        className="input"
        required
      />

      <textarea
        name="description"
        placeholder="Task description"
        value={formData.description}
        onChange={handleChange}
        className="textarea"
      />

      <div className="flex flex-wrap gap-3">
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="select"
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
          className="input"
        />
      </div>

      <input
        type="file"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="w-full text-sm muted"
      />
      {formData.attachmentName && (
        <p className="text-xs muted">
          Selected: {formData.attachmentName}
        </p>
      )}

      <button
        type="submit"
        className="w-full btn btn-primary"
      >
        {editingId ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}
