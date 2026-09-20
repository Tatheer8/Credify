"use client";
import { CheckCircle2, AlertTriangle, MinusCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { DecisionFactor } from "@/lib/types";

interface DecisionFactorsProps {
  factors: DecisionFactor[];
}

export default function DecisionFactors({ factors }: DecisionFactorsProps) {
  if (!factors || factors.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Key Decision Factors
        </p>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400">
          KNN Weights
        </span>
      </div>

      <div className="space-y-2">
        {factors.map((f, i) => {
          const isPositive = f.impact === "positive";
          const isNegative = f.impact === "negative";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.25 }}
              className="flex items-start gap-3 p-3 rounded-xl text-xs sm:text-sm transition-all duration-150"
              style={{
                background: isPositive
                  ? "rgba(16, 185, 129, 0.07)"
                  : isNegative
                  ? "rgba(239, 68, 68, 0.07)"
                  : "rgba(245, 158, 11, 0.07)",
                border: `1px solid ${
                  isPositive
                    ? "rgba(16, 185, 129, 0.22)"
                    : isNegative
                    ? "rgba(239, 68, 68, 0.22)"
                    : "rgba(245, 158, 11, 0.22)"
                }`,
              }}
            >
              <div className="mt-0.5 shrink-0">
                {isPositive ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isNegative ? (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                ) : (
                  <MinusCircle className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold"
                  style={{
                    color: isPositive
                      ? "var(--text-primary)"
                      : isNegative
                      ? "#fca5a5"
                      : "#fcd34d",
                  }}
                >
                  {isPositive ? "✓ " : isNegative ? "✗ " : "• "}
                  {f.factor}
                </p>
                {f.detail && (
                  <p className="text-[11px] sm:text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {f.detail}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
