"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  FEATURE_IMPORTANCE_DATA,
  PREDICTION_DISTRIBUTION_DATA,
} from "@/lib/predictionService";

const CONFUSION_CHART_DATA = [
  { name: "True Negative (TN)", count: 22, color: "#10b981", desc: "Correct Rejection" },
  { name: "False Positive (FP)", count: 16, color: "#ef4444", desc: "Incorrect Approval" },
  { name: "False Negative (FN)", count: 1, color: "#f87171", desc: "Missed Approval" },
  { name: "True Positive (TP)", count: 84, color: "#34d399", desc: "Correct Approval" },
];

const COLORS = ["#10b981", "#ef4444", "#14b8a6", "#06b6d4"];

export default function TransparencyCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. Confusion Matrix Breakdown */}
      <div
        className="p-5 rounded-2xl flex flex-col justify-between"
        style={{
          background: "rgba(15, 26, 38, 0.65)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              1. Confusion Matrix Distribution
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Test Split
            </span>
          </div>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            Observed outcomes vs KNN predicted classes (N=123)
          </p>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={CONFUSION_CHART_DATA}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis type="number" stroke="#64748b" fontSize={10} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#94a3b8"
                fontSize={10}
                width={105}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-slate-100">
                        <p className="font-bold">{data.name}</p>
                        <p className="text-emerald-400 font-semibold">{data.count} samples</p>
                        <p className="text-slate-400 text-[11px]">{data.desc}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {CONFUSION_CHART_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Prediction Distribution (PieChart) */}
      <div
        className="p-5 rounded-2xl flex flex-col justify-between"
        style={{
          background: "rgba(15, 26, 38, 0.65)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              2. Prediction Distribution
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Class Ratio
            </span>
          </div>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            Historical benchmark split: Approved vs Rejected loans
          </p>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PREDICTION_DISTRIBUTION_DATA}
                cx="50%"
                cy="48%"
                innerRadius={48}
                outerRadius={75}
                paddingAngle={5}
                dataKey="count"
              >
                {PREDICTION_DISTRIBUTION_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-slate-100">
                        <p className="font-bold">{data.name}</p>
                        <p className="text-emerald-400 font-semibold">{data.count} records ({data.percentage}%)</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Feature Importance (Horizontal BarChart) */}
      <div
        className="p-5 rounded-2xl flex flex-col justify-between"
        style={{
          background: "rgba(15, 26, 38, 0.65)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              3. Feature Importance
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              KNN Vectors
            </span>
          </div>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            Normalized influence weights in nearest-neighbor distance calculation
          </p>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={FEATURE_IMPORTANCE_DATA}
              layout="vertical"
              margin={{ top: 5, right: 25, left: 15, bottom: 5 }}
            >
              <XAxis
                type="number"
                unit="%"
                stroke="#64748b"
                fontSize={10}
                domain={[0, 42]}
              />
              <YAxis
                dataKey="feature"
                type="category"
                stroke="#94a3b8"
                fontSize={10}
                width={85}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-slate-100">
                        <p className="font-bold">{data.feature}</p>
                        <p className="text-teal-400 font-semibold">{data.weight}% influence</p>
                        <p className="text-slate-400 text-[10px]">Category: {data.category}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="weight" radius={[0, 6, 6, 0]} fill="#14b8a6">
                {FEATURE_IMPORTANCE_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.weight > 30
                        ? "#10b981"
                        : entry.weight > 20
                        ? "#14b8a6"
                        : entry.weight > 10
                        ? "#06b6d4"
                        : "#64748b"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
