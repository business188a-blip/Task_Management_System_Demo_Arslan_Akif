import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import AuthPanel from "./components/AuthPanel";
import TaskList from "./components/TaskList";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tab, setTab] = useState("tasks");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const handleLogin = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <div className="app-shell">
      <Toaster position="top-right" />
      <header className="max-w-6xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="kicker">Workspace</p>
          <h1 className="text-3xl sm:text-4xl font-bold brand text-slate-900 dark:text-white">
            Task Management System
          </h1>
          <p className="text-sm muted mt-1">Plan, share, and ship with clarity.</p>
        </div>

        <div
          className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center"
          style={{ rowGap: "24px", columnGap: "24px", marginBottom: "24px" }}
        >
          <button onClick={() => setDarkMode((prev) => !prev)} className="btn btn-ghost">
            {darkMode ? "Light" : "Dark"} Mode
          </button>
          {token && (
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto animate-rise">
        {!token ? (
          <AuthPanel onLogin={handleLogin} />
        ) : (
          <>
            <div
              className="mb-6 flex flex-wrap"
              style={{ rowGap: "24px", columnGap: "24px", marginTop: "24px" }}
            >
              <button
                onClick={() => setTab("tasks")}
                className={`tab ${tab === "tasks" ? "tab-active" : ""}`}
              >
                Tasks
              </button>
              <button
                onClick={() => setTab("analytics")}
                className={`tab ${tab === "analytics" ? "tab-active" : ""}`}
              >
                Analytics
              </button>
            </div>

            {tab === "tasks" ? <TaskList token={token} /> : <Dashboard token={token} />}
          </>
        )}
      </main>
    </div>
  );
}
