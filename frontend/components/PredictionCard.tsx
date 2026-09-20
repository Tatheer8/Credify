"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Brain,
  ShieldAlert,
  Coins,
} from "lucide-react";
import ConfidenceBar from "./ConfidenceBar";
import DecisionFactors from "./DecisionFactors";
import AssessmentExport from "./AssessmentExport";
import type { LoanFormData, PredictionResult } from "@/lib/types";

interface PredictionCardProps {
  data: LoanFormData;
  result: PredictionResult | null;
  loading: boolean;
  onReset: () => void;
  onExportSuccess?: () => void;
}

export default function PredictionCard({
  data,
  result,
  loading,
  onReset,
  onExportSuccess,
}: PredictionCardProps) {
  // Empty State: Before Prediction
  if (!result && !loading) {
    return (
      <div className="glass p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[460px] space-y-5 border border-dashed border-white/10">
        <div
          className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(13,148,136,0.05) 100%)",
            border: "1px solid rgba(16,185,129,0.25)",
          }}
        >
          <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 stroke-[1.8] animate-pulse" />
        </div>

        <div className="max-w-sm space-y-1.5">
          <h3 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            No prediction yet
          </h3>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
            Complete the 3-step loan application form on the left and click{" "}
            <span className="text-emerald-400 font-semibold">“Get Prediction”</span> to run the KNN model.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-xs pt-4 text-xs" style={{ color: "var(--text-secondary)" }}>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="text-emerald-400 font-bold block text-sm">86.2%</span>
            <span className="text-[11px] text-slate-400">Model Accuracy</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="text-teal-400 font-bold block text-sm">KNN (k=11)</span>
            <span className="text-[11px] text-slate-400">Classifier</span>
          </div>
        </div>
      </div>
    );
  }

  // Loading state while model generates inference
  if (loading) {
    return (
      <div className="glass p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[460px] space-y-6">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <Brain className="w-10 h-10 text-emerald-400 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold gradient-text">
            Analyzing Credit Risk Profile…
          </h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Evaluating normalized distance vectors, DTI ratios, and nearest neighbors in the feature space.
          </p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const isApproved = result.prediction === "Approved";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={result.prediction + result.confidence}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass p-6 sm:p-8 space-y-6 relative overflow-hidden"
        style={{
          borderColor: isApproved ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)",
          boxShadow: isApproved
            ? "0 10px 40px rgba(16,185,129,0.12)"
            : "0 10px 40px rgba(239,68,68,0.12)",
        }}
      >
        {/* Top Header & New Assessment button */}
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${isApproved ? "text-emerald-400" : "text-red-400"}`} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Underwriting Outcome
            </span>
          </div>

          <button
            id="new-assessment-btn"
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer hover:scale-105"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <RefreshCw className="w-3 h-3" />
            New Assessment
          </button>
        </div>

        {/* Verdict Badge with Pulsing Ring & Large Icon */}
        <div className="flex flex-col items-center text-center py-2 space-y-4">
          <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28">
            {/* Outer animated pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: isApproved ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)",
              }}
            />

            {/* Inner icon container */}
            <div
              className="w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center relative z-10 shadow-2xl"
              style={{
                background: isApproved
                  ? "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.35) 100%)"
                  : "linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(185,28,28,0.35) 100%)",
                border: `2px solid ${isApproved ? "#10b981" : "#ef4444"}`,
                boxShadow: isApproved
                  ? "0 0 30px rgba(16,185,129,0.3)"
                  : "0 0 30px rgba(239,68,68,0.3)",
              }}
            >
              {isApproved ? (
                <CheckCircle2 className="w-11 h-11 sm:w-12 sm:h-12 text-emerald-400 stroke-[2.2]" />
              ) : (
                <XCircle className="w-11 h-11 sm:w-12 sm:h-12 text-red-400 stroke-[2.2]" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="inline-flex items-center gap-1.5 px-6 py-1.5 rounded-full text-lg sm:text-xl font-extrabold tracking-wide"
              style={{
                background: isApproved ? "rgba(16,185,129,0.14)" : "rgba(239,68,68,0.14)",
                color: isApproved ? "var(--success-400)" : "var(--danger-400)",
                border: `1.5px solid ${isApproved ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
              }}
            >
              {isApproved ? "Approved" : "Rejected"}
            </motion.div>
            <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              {isApproved
                ? "This application meets approval criteria"
                : "This application does not meet approval criteria"}
            </p>
          </div>
        </div>

        {/* Approval Confidence Progress Bar */}
        <div className="pt-1">
          <ConfidenceBar confidence={result.confidence} isApproved={isApproved} />
        </div>

        {/* Estimated Monthly EMI */}
        <div
          className="flex items-center justify-between p-4 rounded-2xl transition-all"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Estimated Monthly EMI
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                Principal: ${Number(data.loanAmount).toLocaleString()}K • {data.loanTerm} mo
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className="text-xl sm:text-2xl font-black tabular-nums"
              style={{
                fontFamily: "var(--font-space), sans-serif",
                color: "var(--brand-400)",
              }}
            >
              ${result.estimatedEMI.toLocaleString()}
            </span>
            <span className="text-[11px] block" style={{ color: "var(--text-muted)" }}>
              per month
            </span>
          </div>
        </div>

        {/* Key Decision Factors */}
        <DecisionFactors factors={result.factors} />

        {/* Actions: Export Assessment button & New Assessment button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="w-full sm:flex-1">
            <AssessmentExport data={data} result={result} onExportSuccess={onExportSuccess} />
          </div>
          <button
            type="button"
            onClick={onReset}
            className="btn-secondary w-full sm:w-auto text-xs sm:text-sm px-4 py-2.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
