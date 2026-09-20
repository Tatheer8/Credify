"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { predict } from "@/lib/api";
import type { LoanApplication, PredictionResult } from "@/lib/api";

interface Props {
  baseApplication: LoanApplication | null;
}

function debounce<T extends unknown[]>(fn: (...args: T) => void, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export default function WhatIfSimulator({ baseApplication }: Props) {
  const [income,     setIncome]     = useState(5000);
  const [loanAmount, setLoanAmount] = useState(120);
  const [result,     setResult]     = useState<PredictionResult | null>(null);
  const [loading,    setLoading]    = useState(false);
  const initialised = useRef(false);

  const runPredict = useCallback(
    async (inc: number, loan: number) => {
      if (!baseApplication) return;
      setLoading(true);
      try {
        const res = await predict({
          ...baseApplication,
          ApplicantIncome: inc,
          LoanAmount: loan,
        });
        setResult(res);
      } catch {
        /* silent — API might not be running */
      } finally {
        setLoading(false);
      }
    },
    [baseApplication]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPredict = useCallback(debounce(runPredict, 400), [runPredict]);

  // Sync sliders to base application values
  useEffect(() => {
    if (baseApplication && !initialised.current) {
      setIncome(baseApplication.ApplicantIncome);
      setLoanAmount(baseApplication.LoanAmount);
      initialised.current = true;
    }
  }, [baseApplication]);

  useEffect(() => {
    if (baseApplication) debouncedPredict(income, loanAmount);
  }, [income, loanAmount, debouncedPredict, baseApplication]);

  if (!baseApplication) return (
    <div className="glass p-6 text-center space-y-2" style={{ minHeight: "200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Sliders className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
      <p className="font-medium" style={{ color: "var(--text-primary)" }}>What-If Simulator</p>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Run a prediction first to enable the simulator</p>
    </div>
  );

  const isApproved = result?.status === "Approved";
  const pct        = result ? Math.round(result.confidence_score * 100) : 0;
  const dti        = loanAmount / (income + 1);

  return (
    <div className="glass p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Sliders className="w-5 h-5" style={{ color: "var(--brand-400)" }} />
        <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>What-If Simulator</h3>
        <span className="text-xs px-2 py-0.5 rounded-full ml-auto font-medium"
          style={{ background: "rgba(16,185,129,0.12)", color: "var(--brand-400)", border: "1px solid rgba(16,185,129,0.2)" }}>
          Live
        </span>
      </div>

      {/* Income slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label htmlFor="sim-income" className="font-medium" style={{ color: "var(--text-secondary)" }}>
            Applicant Income
          </label>
          <span className="font-bold tabular-nums" style={{ color: "var(--brand-400)" }}>
            ${income.toLocaleString()}/mo
          </span>
        </div>
        <input
          id="sim-income"
          type="range"
          min={1000}
          max={30000}
          step={500}
          value={income}
          onChange={e => setIncome(Number(e.target.value))}
          className="slider-custom"
          style={{
            backgroundImage: `linear-gradient(90deg, #059669 ${((income - 1000) / 29000) * 100}%, var(--bg-elevated) 0)`
          }}
        />
        <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
          <span>$1,000</span><span>$30,000</span>
        </div>
      </div>

      {/* Loan amount slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label htmlFor="sim-loan" className="font-medium" style={{ color: "var(--text-secondary)" }}>
            Loan Amount
          </label>
          <span className="font-bold tabular-nums" style={{ color: "var(--brand-400)" }}>
            ${loanAmount}K
          </span>
        </div>
        <input
          id="sim-loan"
          type="range"
          min={10}
          max={700}
          step={10}
          value={loanAmount}
          onChange={e => setLoanAmount(Number(e.target.value))}
          className="slider-custom"
          style={{
            backgroundImage: `linear-gradient(90deg, #059669 ${((loanAmount - 10) / 690) * 100}%, var(--bg-elevated) 0)`
          }}
        />
        <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
          <span>$10K</span><span>$700K</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Debt-to-Income</p>
          <p className="font-bold mt-0.5" style={{ color: dti > 0.6 ? "var(--danger-400)" : dti > 0.3 ? "var(--warning-500)" : "var(--success-400)" }}>
            {(dti * 100).toFixed(1)}%
          </p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loan / Income Ratio</p>
          <p className="font-bold mt-0.5" style={{ color: "var(--brand-400)" }}>
            {(loanAmount * 1000 / (income * 12)).toFixed(2)}x
          </p>
        </div>
      </div>

      {/* Live result */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--brand-400)" }} />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>Re-running model…</span>
          </motion.div>
        ) : result && (
          <motion.div key={result.status + pct} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{
              background: isApproved ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${isApproved ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}>
            {isApproved
              ? <CheckCircle className="w-6 h-6 shrink-0" style={{ color: "var(--success-400)" }} />
              : <XCircle    className="w-6 h-6 shrink-0" style={{ color: "var(--danger-400)" }} />}
            <div>
              <p className="font-bold" style={{ color: isApproved ? "var(--success-400)" : "var(--danger-400)" }}>
                {result.status}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Confidence: {pct}%
              </p>
            </div>
            {/* Mini confidence bar */}
            <div className="ml-auto w-20">
              <div className="h-1.5 rounded-full" style={{ background: "var(--bg-elevated)" }}>
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6 }}
                  style={{ background: isApproved ? "var(--success-500)" : "var(--danger-500)" }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
