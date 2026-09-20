"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  ChevronDown,
  ChevronUp,
  Award,
  Target,
  Search,
  Activity,
  Sliders,
  Layers,
  Sparkles,
} from "lucide-react";
import ConfusionMatrix from "./ConfusionMatrix";
import TransparencyCharts from "./TransparencyCharts";
import { DEFAULT_MODEL_METRICS } from "@/lib/predictionService";

export default function ModelTransparency() {
  const [isOpen, setIsOpen] = useState(false);
  const metrics = DEFAULT_MODEL_METRICS;

  const metricCards = [
    {
      label: "Accuracy",
      value: `${(metrics.accuracy * 100).toFixed(1)}%`,
      sub: "Correct total classifications",
      icon: Award,
      color: "#10b981",
    },
    {
      label: "Precision",
      value: `${(metrics.precision * 100).toFixed(1)}%`,
      sub: "Approval prediction reliability",
      icon: Target,
      color: "#14b8a6",
    },
    {
      label: "Recall",
      value: `${(metrics.recall * 100).toFixed(1)}%`,
      sub: "Approved cases correctly caught",
      icon: Search,
      color: "#06b6d4",
    },
    {
      label: "F1 Score",
      value: `${(metrics.f1_score * 100).toFixed(1)}%`,
      sub: "Harmonic precision-recall mean",
      icon: Activity,
      color: "#34d399",
    },
  ];

  return (
    <div className="glass overflow-hidden transition-all duration-300">
      {/* Header Toggle Accordion */}
      <button
        id="toggle-model-transparency"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors duration-200 cursor-pointer hover:bg-white/[0.02]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(13,148,136,0.2) 100%)",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                Model Transparency
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                k = 11 Neighbors
              </span>
            </div>
            <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              KNN evaluation metrics &amp; confusion matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold hidden md:block" style={{ color: "var(--text-secondary)" }}>
            {isOpen ? "Hide Evaluation Metrics" : "View Evaluation Metrics"}
          </span>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
            }}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="border-t"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div className="p-5 sm:p-7 space-y-7">
              {/* 4 Performance Metric Cards */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                  Primary Classification Benchmarks
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {metricCards.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.label}
                        className="p-4 rounded-2xl flex flex-col justify-between space-y-2 transition-all hover:scale-[1.02]"
                        style={{
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--border-default)",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                            {m.label}
                          </span>
                          <Icon className="w-4 h-4" style={{ color: m.color }} />
                        </div>
                        <div>
                          <p
                            className="text-xl sm:text-2xl font-black tracking-tight"
                            style={{ fontFamily: "var(--font-space), sans-serif", color: m.color }}
                          >
                            {m.value}
                          </p>
                          <p className="text-[10px] sm:text-[11px] truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>
                            {m.sub}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Model Specifications Bar */}
              <div
                className="p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400">Algorithm:</span>
                  <span className="font-semibold text-slate-200">K-Nearest Neighbors (KNN)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-400" />
                  <span className="text-slate-400">Optimal Hyperparameter:</span>
                  <span className="font-semibold text-slate-200">k = {metrics.optimal_k}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-400">Distance Metric:</span>
                  <span className="font-semibold text-slate-200">Euclidean (Minkowski p=2)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400">Dataset Split:</span>
                  <span className="font-semibold text-slate-200">
                    {metrics.training_size} Train / {metrics.test_size} Test (80/20)
                  </span>
                </div>
              </div>

              {/* Confusion Matrix Detailed Component */}
              <ConfusionMatrix matrix={metrics.confusion_matrix} />

              {/* Recharts Analytics Charts: Confusion Distribution, Class Ratio, Feature Importance */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                  Recharts Model Analytics
                </p>
                <TransparencyCharts />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
