export default function TaskItem({
  task,
  currentUserId,
  handleEdit,
  handleDelete,
  handleShare,
  handleStatusChange,
  apiOrigin,
}) {
  const owner = String(task.owner) === String(currentUserId);

  const attachmentUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    return `${apiOrigin}${url}`;
  };

  return (
    <li className="card-muted p-4 sm:p-5 flex flex-col md:flex-row justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{task.title}</h3>
          <span
            className={`badge ${
              task.status === "Completed"
                ? "badge-completed"
                : task.status === "In Progress"
                ? "badge-progress"
                : "badge-pending"
            }`}
          >
            {task.status}
          </span>
        </div>

        {task.description && (
          <p className="text-sm muted mt-2">{task.description}</p>
        )}

        <div className="text-xs muted mt-3 flex flex-wrap gap-3">
          {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
          <span>{owner ? "Owner" : "Shared"}</span>
        </div>

        {Array.isArray(task.attachments) && task.attachments.length > 0 && (
          <ul className="mt-2 space-y-1">
            {task.attachments.map((file, idx) => (
              <li key={`${file.fileUrl}-${idx}`}>
                <a href={attachmentUrl(file.fileUrl)} target="_blank" rel="noreferrer" className="text-xs muted underline">
                  {file.fileName}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-start">
        {owner && (
          <button onClick={() => handleEdit(task)} className="btn btn-ghost text-sm">
            Edit
          </button>
        )}

        {owner && (
          <button onClick={() => handleDelete(task._id)} className="btn btn-danger text-sm">
            Delete
          </button>
        )}

        {owner && (
          <button onClick={() => handleShare(task)} className="btn btn-primary text-sm">
            Share Task
          </button>
        )}

        {!owner && (
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task._id, e.target.value)}
            className="select text-xs"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        )}
      </div>
    </li>
  );
}
