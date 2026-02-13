import { useState } from "react";
import toast from "react-hot-toast";
import { loginUser, registerUser } from "../api";

export default function AuthPanel({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (mode === "register") {
        await registerUser(form);
        toast.success("Registered successfully. Please log in.");
        setMode("login");
        return;
      }
      const data = await loginUser({ email: form.email, password: form.password });
      onLogin(data.token);
      toast.success("Logged in");
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="max-w-md mx-auto card p-6 sm:p-8">
      <p className="kicker">Welcome</p>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-slate-900 dark:text-white">
        {mode === "login" ? "Sign in to continue" : "Create your account"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "register" && (
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="input"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="input"
          required
        />
        <button
          type="submit"
          className="w-full btn btn-primary"
        >
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button
        onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
        className="mt-4 text-sm muted"
      >
        {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
}
