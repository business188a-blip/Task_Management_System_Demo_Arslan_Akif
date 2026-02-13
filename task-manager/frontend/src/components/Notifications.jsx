export default function Notifications({
  open,
  notifications,
  onClose,
  onMarkOneRead,
  onMarkAllRead,
}) {
  return (
    <aside
      className={`${
        open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0 lg:opacity-100"
      } transition-all duration-300 card p-4 h-fit lg:sticky lg:top-6`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
        <div className="flex gap-2">
          <button
            onClick={onMarkAllRead}
            className="text-xs underline muted"
          >
            Mark all read
          </button>
          <button onClick={onClose} className="text-xs muted lg:hidden">
            Close
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm muted">No notifications yet.</p>
      ) : (
        <ul className="space-y-2 max-h-[65vh] overflow-y-auto">
          {notifications.map((n) => (
            <li
              key={n._id || `${n.message}-${n.createdAt}`}
              className={`rounded-xl border px-3 py-2 ${
                n.read
                  ? "bg-transparent border-[color:var(--border)]"
                  : "bg-[rgba(20,184,166,0.08)] border-[color:var(--border)]"
              }`}
            >
              <p className="text-sm text-slate-800 dark:text-slate-100">{n.message}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[11px] muted">
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                </span>
                {!n.read && n._id && (
                  <button
                    onClick={() => onMarkOneRead(n._id)}
                    className="text-xs underline muted"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
