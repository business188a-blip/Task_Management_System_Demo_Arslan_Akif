import { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import Notifications from "./Notifications";
import {
  apiMeta,
  createTask,
  deleteTask,
  getNotifications,
  getTasks,
  readAllNotifications,
  readNotification,
  shareTask,
  updateTask,
} from "../api";

const decodeUserId = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
};

const toAttachmentPayload = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.split(",")[1];
      resolve({
        fileName: file.name,
        fileType: file.type,
        size: file.size,
        contentBase64: base64,
      });
    };
    reader.onerror = () => reject(new Error("Unable to read attachment"));
    reader.readAsDataURL(file);
  });

export default function TaskList({ token }) {
  const currentUserId = useMemo(() => decodeUserId(token), [token]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: "",
    attachmentName: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks(token);
      setTasks(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tasks");
    }
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications(token);
      setNotifications(data);
    } catch {
      toast.error("Failed to load notifications");
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
    fetchNotifications();
  }, [fetchNotifications, fetchTasks]);

  useEffect(() => {
    if (!currentUserId) return;
    const socket = io(apiMeta.API_ORIGIN);
    socket.emit("join", { userId: currentUserId });
    socket.on("notification", (n) => {
      setNotifications((prev) => [{ ...n, read: false, createdAt: new Date().toISOString() }, ...prev]);
      setShowNotifications(true);
      toast.success(n.message || "New notification");
    });
    return () => socket.disconnect();
  }, [currentUserId]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "Pending",
      dueDate: "",
      attachmentName: "",
    });
    setSelectedFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        dueDate: formData.dueDate || null,
      };

      const attachment = await toAttachmentPayload(selectedFile);
      if (attachment) payload.attachment = attachment;

      if (editingId) {
        await updateTask(editingId, payload, token);
        toast.success("Task updated");
      } else {
        await createTask(payload, token);
        toast.success("Task created");
      }

      await fetchTasks();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save task");
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "Pending",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      attachmentName: "",
    });
    setSelectedFile(null);
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId, token);
      toast.success("Task deleted");
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleShare = async (task) => {
    const userId = window.prompt("Enter recipient user ID");
    if (!userId) return;

    try {
      const data = await shareTask(task._id, userId.trim(), token);
      toast.success(data.message || "Task shared");
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Share failed");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTask(taskId, { status }, token);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  const markOneRead = async (id) => {
    try {
      await readNotification(id, token);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch {
      toast.error("Failed to mark read");
    }
  };

  const markAllRead = async () => {
    try {
      await readAllNotifications(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      toast.error("Failed to mark all read");
    }
  };

  const filteredTasks = tasks
    .filter((task) => (filter ? task.status === filter : true))
    .filter((task) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return `${task.title || ""} ${task.description || ""}`.toLowerCase().includes(q);
    });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
      <section className="card p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <p className="kicker">Tasks</p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your workload</h2>
          </div>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="btn btn-ghost text-sm"
          >
            Notifications ({unreadCount})
          </button>
        </div>

        <TaskForm
          formData={formData}
          editingId={editingId}
          handleChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          handleFileChange={(file) => {
            setSelectedFile(file);
            setFormData((prev) => ({ ...prev, attachmentName: file?.name || "" }));
          }}
          handleSubmit={handleSubmit}
        />

        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            placeholder="Search tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select"
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="muted">No tasks found.</p>
        ) : (
          <ul className="space-y-2">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                currentUserId={currentUserId}
                apiOrigin={apiMeta.API_ORIGIN}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleShare={handleShare}
                handleStatusChange={handleStatusChange}
              />
            ))}
          </ul>
        )}
      </section>

      <Notifications
        open={showNotifications}
        notifications={notifications}
        onClose={() => setShowNotifications(false)}
        onMarkOneRead={markOneRead}
        onMarkAllRead={markAllRead}
      />
    </div>
  );
}
