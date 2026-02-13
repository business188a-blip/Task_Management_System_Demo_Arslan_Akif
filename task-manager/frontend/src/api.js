import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const withAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const apiMeta = {
  API_BASE_URL,
  API_ORIGIN: API_BASE_URL.replace(/\/api$/, ""),
};

export async function registerUser(payload) {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, payload);
  return res.data;
}

export async function loginUser(payload) {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, payload);
  return res.data;
}

export async function getTasks(token) {
  const res = await axios.get(`${API_BASE_URL}/tasks`, withAuth(token));
  return res.data;
}

export async function createTask(payload, token) {
  const res = await axios.post(`${API_BASE_URL}/tasks`, payload, withAuth(token));
  return res.data;
}

export async function updateTask(taskId, payload, token) {
  const res = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, payload, withAuth(token));
  return res.data;
}

export async function deleteTask(taskId, token) {
  const res = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, withAuth(token));
  return res.data;
}

export async function shareTask(taskId, userId, token) {
  const res = await axios.put(
    `${API_BASE_URL}/tasks/${taskId}/share`,
    { userId },
    withAuth(token)
  );
  return res.data;
}

export async function getNotifications(token) {
  const res = await axios.get(`${API_BASE_URL}/notifications`, withAuth(token));
  return res.data;
}

export async function readNotification(notificationId, token) {
  const res = await axios.put(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    {},
    withAuth(token)
  );
  return res.data;
}

export async function readAllNotifications(token) {
  const res = await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, withAuth(token));
  return res.data;
}

export async function getAnalyticsOverview(token) {
  const res = await axios.get(`${API_BASE_URL}/analytics/overview`, withAuth(token));
  return res.data;
}

export async function getAnalyticsTrends(range, token) {
  const res = await axios.get(
    `${API_BASE_URL}/analytics/trends?range=${encodeURIComponent(range)}`,
    withAuth(token)
  );
  return res.data;
}
