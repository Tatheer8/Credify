"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, ChevronDown, ChevronUp, Cpu } from "lucide-react";
import { getMetrics } from "@/lib/api";
import type { ModelMetrics } from "@/lib/api";

export default function ModelMetricsCard() {
  const [metrics,   setMetrics]   = useState<ModelMetrics | null>(null);
  const [expanded,  setExpanded]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const m = await getMetrics();
        setMetrics(m);
      } catch {
        setError("Could not reach API — is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function pct(v: number) { return `${(v * 100).toFixed(1)}%`; }

  return (
    <div className="glass overflow-hidden">
      {/* Header toggle */}
      <button
        id="toggle-metrics"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5" style={{ color: "var(--brand-400)" }} />
          <div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Model Transparency</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>KNN evaluation metrics &amp; confusion matrix</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  : <ChevronDown className="w-5 h-5" style={{ color: "var(--text-muted)" }} />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-5 space-y-5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              {loading && (
                <div className="flex items-center gap-2 pt-4 text-sm" style={{ color: "var(--text-muted)" }}>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Loading metrics…
                </div>
              )}

              {error && (
                <p className="pt-4 text-sm" style={{ color: "var(--danger-400)" }}>{error}</p>
              )}

              {metrics && (
                <>
                  {/* Model info */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    {[
                      { label: "Algorithm",       value: "KNN" },
                      { label: "Optimal k",        value: metrics.optimal_k },
                      { label: "Distance Metric",  value: metrics.best_metric },
                      { label: "Feature Count",    value: metrics.feature_count },
                      { label: "Training Samples", value: metrics.training_size },
                      { label: "Test Samples",     value: metrics.test_size },
                    ].map(({ label, value }) => (
                      <div key={label} className="px-3 py-2 rounded-lg" style={{ background: "var(--bg-elevated)" }}>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                        <p className="font-bold text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Metric bars */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Performance Metrics
                    </p>
                    {[
                      { label: "Accuracy",  value: metrics.accuracy,  color: "#10b981" },
                      { label: "Precision", value: metrics.precision, color: "#14b8a6" },
                      { label: "Recall",    value: metrics.recall,    color: "#06b6d4" },
                      { label: "F1 Score",  value: metrics.f1_score,  color: "#34d399" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                          <span className="font-bold tabular-nums" style={{ color }}>{pct(value)}</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: pct(value) }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Confusion matrix */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Confusion Matrix
                    </p>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div />
                      <div className="text-center font-medium pb-1" style={{ color: "var(--text-muted)" }}>Pred. Rejected</div>
                      <div className="text-center font-medium pb-1" style={{ color: "var(--text-muted)" }}>Pred. Approved</div>

                      <div className="font-medium flex items-center" style={{ color: "var(--text-muted)" }}>Actual Rejected</div>
                      <div className="p-2 rounded-lg text-center font-bold" style={{ background: "rgba(16,185,129,0.12)", color: "var(--success-400)" }}>
                        {metrics.confusion_matrix.tn}
                        <div className="font-normal text-xs opacity-70">TN</div>
                      </div>
                      <div className="p-2 rounded-lg text-center font-bold" style={{ background: "rgba(239,68,68,0.12)", color: "var(--danger-400)" }}>
                        {metrics.confusion_matrix.fp}
                        <div className="font-normal text-xs opacity-70">FP</div>
                      </div>

                      <div className="font-medium flex items-center" style={{ color: "var(--text-muted)" }}>Actual Approved</div>
                      <div className="p-2 rounded-lg text-center font-bold" style={{ background: "rgba(239,68,68,0.12)", color: "var(--danger-400)" }}>
                        {metrics.confusion_matrix.fn}
                        <div className="font-normal text-xs opacity-70">FN</div>
                      </div>
                      <div className="p-2 rounded-lg text-center font-bold" style={{ background: "rgba(16,185,129,0.12)", color: "var(--success-400)" }}>
                        {metrics.confusion_matrix.tp}
                        <div className="font-normal text-xs opacity-70">TP</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
