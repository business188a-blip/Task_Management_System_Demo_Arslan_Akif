import { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/auth/login", form)
      .then(res => {
        login(res.data.token);
        toast.success("Logged in!");
      })
      .catch(() => toast.error("Invalid credentials"));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-6 border rounded">
      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Login
      </button>
    </form>
  );
}
