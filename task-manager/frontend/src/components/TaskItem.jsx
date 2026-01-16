export default function TaskItem({ task, handleEdit, handleDelete }) {
  return (
    <li className="border rounded p-4 flex justify-between items-start bg-gray-50">
      <div>
        <h3 className="font-semibold text-lg">{task.title}</h3>

        {task.description && (
          <p className="text-gray-600 text-sm mt-1">
            {task.description}
          </p>
        )}

        <div className="text-xs text-gray-500 mt-2">
          Status: {task.status}
          {task.dueDate && (
            <> • Due: {new Date(task.dueDate).toLocaleDateString()}</>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(task)}
          className="text-blue-600 hover:underline text-sm"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(task._id)}
          className="text-red-600 hover:underline text-sm"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
