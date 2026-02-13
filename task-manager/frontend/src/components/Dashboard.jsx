import { useCallback, useEffect, useState } from "react";
import { getAnalyticsOverview, getAnalyticsTrends } from "../api";

const COLORS = {
  Pending: "#f59e0b",
  "In Progress": "#3b82f6",
  Completed: "#10b981",
};

export default function Dashboard({ token }) {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [range, setRange] = useState("weekly");

  const loadData = useCallback(async () => {
    const [overviewData, trendData] = await Promise.all([
      getAnalyticsOverview(token),
      getAnalyticsTrends(range, token),
    ]);
    setOverview(overviewData);
    setTrends(trendData.data || []);
  }, [range, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!overview) {
    return (
      <section className="card p-4 sm:p-6">
        <p className="muted">Loading analytics...</p>
      </section>
    );
  }

  const summary = overview.summary;

  return (
    <section className="card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="kicker">Insights</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h2>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="select"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" value={summary.total} />
        <StatCard label="Completed" value={summary.completed} />
        <StatCard label="Pending" value={summary.pending} />
        <StatCard label="Overdue" value={summary.overdue} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2 text-slate-800 dark:text-slate-200">Status Breakdown</h3>
          <div className="space-y-2">
            {overview.statusBreakdown.map((entry) => {
              const total = Math.max(summary.total, 1);
              const pct = Math.round((entry.count / total) * 100);
              return (
                <div key={entry.status}>
                  <div className="flex justify-between text-sm text-slate-700 dark:text-slate-200">
                    <span>{entry.status}</span>
                    <span>
                      {entry.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded bg-[rgba(100,116,139,0.25)] mt-1">
                    <div
                      className="h-2 rounded"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: COLORS[entry.status] || "#64748b",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2 text-slate-800 dark:text-slate-200">Completed vs Overdue</h3>
          <div className="space-y-3">
            {trends.length === 0 && (
              <p className="text-sm muted">No trend data yet.</p>
            )}
            {trends.map((item) => {
              const max = Math.max(item.completed, item.overdue, 1);
              return (
                <div key={item.period} className="card-muted p-3">
                  <p className="text-xs mb-2 muted">{item.period}</p>
                  <div className="space-y-1">
                    <BarRow
                      label="Completed"
                      value={item.completed}
                      width={Math.round((item.completed / max) * 100)}
                      color="#10b981"
                    />
                    <BarRow
                      label="Overdue"
                      value={item.overdue}
                      width={Math.round((item.overdue / max) * 100)}
                      color="#ef4444"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card-muted p-3">
      <p className="text-xs uppercase tracking-wide muted">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function BarRow({ label, value, width, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-700 dark:text-slate-200">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded bg-[rgba(100,116,139,0.25)] mt-1">
        <div className="h-2 rounded" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
