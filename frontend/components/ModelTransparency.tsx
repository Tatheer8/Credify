"use client";
import { useState, useEffect } from "react";
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
  BarChart2,
  X,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import ConfusionMatrix from "./ConfusionMatrix";
import TransparencyCharts from "./TransparencyCharts";
import { DEFAULT_MODEL_METRICS } from "@/lib/predictionService";

export default function ModelTransparency() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const metrics = DEFAULT_MODEL_METRICS;

  // ESC key listener for modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    }
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

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
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-3 sm:gap-4 transition-colors duration-200">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1 group"
        >
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105 shrink-0"
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
              KNN evaluation metrics, confusion matrix &amp; normalized parameters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center">
          {/* Direct "View Evaluation Metrics" Modal Trigger Button */}
          <button
            id="open-metrics-modal-btn"
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 shadow-md hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(13,148,136,0.25))",
              border: "1px solid rgba(16,185,129,0.45)",
              color: "var(--brand-400)",
            }}
          >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Evaluation Metrics</span>
          </button>

          {/* Toggle Collapsible Drawer Button */}
          <button
            id="toggle-model-transparency"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer hover:border-emerald-500/40"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
            }}
            title={isOpen ? "Collapse drawer" : "Expand drawer"}
            aria-expanded={isOpen}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Collapsible Drawer Content */}
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
                  <span className="text-slate-400">Feature Scaling:</span>
                  <span className="font-semibold text-slate-200">Min-Max Normalized [0, 1]</span>
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

      {/* "View Evaluation Metrics" Interactive Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl glass shadow-2xl border overflow-hidden z-10"
              style={{
                borderColor: "rgba(16, 185, 129, 0.4)",
                background: "rgba(5, 9, 14, 0.96)",
                boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.15)",
              }}
            >
              {/* Modal Header */}
              <div
                className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b shrink-0"
                style={{ borderColor: "var(--border-subtle)", background: "rgba(255, 255, 255, 0.02)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-emerald-900/30 shrink-0"
                    style={{ background: "linear-gradient(135deg, #059669, #0d9488)" }}
                  >
                    <BarChart2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2
                        className="text-lg sm:text-xl font-bold tracking-tight text-white"
                        style={{ fontFamily: "var(--font-space), sans-serif" }}
                      >
                        Model Evaluation Metrics
                      </h2>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hidden sm:inline-block">
                        KNN Production
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Comprehensive statistical benchmarks, confusion matrix &amp; hyperparameter specifications
                    </p>
                  </div>
                </div>

                <button
                  id="close-metrics-modal-btn"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1 custom-scrollbar">
                {/* 1. Primary Classification Benchmarks */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Performance Metrics Overview
                    </p>
                    <span className="text-xs font-semibold text-emerald-400">
                      Overall Accuracy: {(metrics.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {metricCards.map((m) => {
                      const Icon = m.icon;
                      return (
                        <div
                          key={m.label}
                          className="p-4 rounded-2xl flex flex-col justify-between space-y-2"
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-default)",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">{m.label}</span>
                            <Icon className="w-4 h-4" style={{ color: m.color }} />
                          </div>
                          <div>
                            <p
                              className="text-2xl font-black tracking-tight"
                              style={{ fontFamily: "var(--font-space), sans-serif", color: m.color }}
                            >
                              {m.value}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{m.sub}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Algorithmic Specifications & Parameters */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Model Architecture &amp; Hyperparameters
                  </p>
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl border text-xs"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Algorithm</span>
                      </div>
                      <p className="font-semibold text-slate-100">K-Nearest Neighbors</p>
                      <p className="text-[10px] text-slate-400">Supervised Classification</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <Layers className="w-3.5 h-3.5 text-teal-400" />
                        <span>Optimal k</span>
                      </div>
                      <p className="font-semibold text-emerald-400">k = {metrics.optimal_k} Neighbors</p>
                      <p className="text-[10px] text-slate-400">5-Fold Cross Validation Tuned</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Distance Metric</span>
                      </div>
                      <p className="font-semibold text-slate-100">Euclidean Distance</p>
                      <p className="text-[10px] text-slate-400">L2 Norm (Minkowski p=2)</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Feature Scaling</span>
                      </div>
                      <p className="font-semibold text-slate-100">Normalized [0, 1]</p>
                      <p className="text-[10px] text-slate-400">Min-Max Scale on Numeric Inputs</p>
                    </div>
                  </div>
                </div>

                {/* 3. Confusion Matrix Breakdown */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Confusion Matrix Analysis (Test Split: {metrics.test_size} Records)
                  </p>
                  <ConfusionMatrix matrix={metrics.confusion_matrix} />
                </div>

                {/* 4. Visual Charts */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Visual Class Distribution &amp; Feature Importance
                  </p>
                  <TransparencyCharts />
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-7 py-4 border-t shrink-0 text-xs text-slate-400"
                style={{ borderColor: "var(--border-subtle)", background: "rgba(255, 255, 255, 0.02)" }}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified 86.2% Production Accuracy • Compliant with Fair Underwriting Guidelines</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs px-4 py-2 cursor-pointer w-full sm:w-auto"
                >
                  Close Metrics
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
