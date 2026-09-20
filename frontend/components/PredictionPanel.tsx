"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import type { PredictionResult } from "@/lib/api";

interface Props {
  result: PredictionResult | null;
}

const IMPACT_CONFIG = {
  positive: { icon: TrendingUp,   color: "var(--success-400)", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
  negative: { icon: TrendingDown, color: "var(--danger-400)",  bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)" },
  neutral:  { icon: Minus,        color: "var(--warning-500)", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
};

export default function PredictionPanel({ result }: Props) {
  const barRef = useRef<HTMLDivElement>(null);

  const isApproved = result?.status === "Approved";
  const pct        = result ? Math.round(result.confidence_score * 100) : 0;

  // Animate bar on result change
  useEffect(() => {
    if (!barRef.current || !result) return;
    barRef.current.style.width = "0%";
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    }, 100);
    return () => clearTimeout(t);
  }, [result, pct]);

  if (!result) return (
    <div className="glass p-6 flex flex-col items-center justify-center text-center min-h-[200px] space-y-3">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--bg-elevated)" }}>
        <AlertCircle className="w-7 h-7" style={{ color: "var(--text-muted)" }} />
      </div>
      <div>
        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>No prediction yet</p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Complete the loan form and click &ldquo;Get Prediction&rdquo;
        </p>
      </div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={result.status}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass p-6 space-y-6"
      >
        {/* Verdict */}
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          {/* Pulse ring + icon */}
          <div className="relative flex items-center justify-center w-24 h-24">
            {/* Outer pulse */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ background: isApproved ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)" }}
            />
            <div className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
              style={{
                background: isApproved
                  ? "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.25))"
                  : "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.25))",
                border: `2px solid ${isApproved ? "var(--success-400)" : "var(--danger-400)"}`,
              }}>
              {isApproved
                ? <CheckCircle className="w-10 h-10" style={{ color: "var(--success-400)" }} />
                : <XCircle    className="w-10 h-10" style={{ color: "var(--danger-400)" }} />}
            </div>
          </div>

          <div>
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center px-5 py-1.5 rounded-full text-lg font-bold"
              style={{
                background: isApproved ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                color: isApproved ? "var(--success-400)" : "var(--danger-400)",
                border: `1px solid ${isApproved ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
              }}
            >
              {result.status}
            </motion.div>
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
              {isApproved ? "This application meets approval criteria" : "This application does not meet approval criteria"}
            </p>
          </div>
        </div>

        {/* Confidence gauge */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium" style={{ color: "var(--text-secondary)" }}>Approval Confidence</span>
            <motion.span
              key={pct}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold tabular-nums"
              style={{ color: isApproved ? "var(--success-400)" : "var(--danger-400)" }}
            >
              {pct}%
            </motion.span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
            <div
              ref={barRef}
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${pct}%`,
                background: isApproved
                  ? "linear-gradient(90deg, #059669, #10b981)"
                  : "linear-gradient(90deg, #dc2626, #ef4444)",
              }}
            />
          </div>
          <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
            <span>0% (Rejected)</span><span>100% (Approved)</span>
          </div>
        </div>

        {/* EMI */}
        <div className="flex items-center justify-between p-3 rounded-xl"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Estimated Monthly EMI</span>
          <span className="font-bold text-base" style={{ color: "var(--brand-400)" }}>
            ${result.emi_estimate.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* Key factors */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Key Decision Factors
          </p>
          {result.key_factors.map((f, i) => {
            const cfg  = IMPACT_CONFIG[f.impact];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 p-3 rounded-xl text-sm"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: cfg.color }} />
                <div>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>{f.factor}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{f.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
