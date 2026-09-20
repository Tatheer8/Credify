"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfidenceBarProps {
  confidence: number; // 0 to 1
  isApproved: boolean;
}

export default function ConfidenceBar({ confidence, isApproved }: ConfidenceBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const pct = Math.round(confidence * 100);

  useEffect(() => {
    // Reset and animate forward smoothly
    setAnimatedWidth(0);
    const timer = setTimeout(() => {
      setAnimatedWidth(pct);
    }, 120);
    return () => clearTimeout(timer);
  }, [confidence, pct]);

  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>
          Approval Confidence
        </span>
        <motion.span
          key={pct}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-lg font-bold tabular-nums"
          style={{
            fontFamily: "var(--font-space), sans-serif",
            color: isApproved ? "var(--success-400)" : "var(--danger-400)",
          }}
        >
          {pct}%
        </motion.span>
      </div>

      {/* Progress track */}
      <div
        className="h-3.5 rounded-full overflow-hidden p-[2px] relative"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{
            width: `${animatedWidth}%`,
            background: isApproved
              ? "linear-gradient(90deg, #059669 0%, #10b981 70%, #34d399 100%)"
              : "linear-gradient(90deg, #b91c1c 0%, #ef4444 70%, #f87171 100%)",
            boxShadow: isApproved
              ? "0 0 14px rgba(16, 185, 129, 0.5)"
              : "0 0 14px rgba(239, 68, 68, 0.5)",
          }}
        >
          {/* Subtle animated shimmer highlight inside progress */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_2s_infinite]" />
        </div>
      </div>

      {/* Range Scale */}
      <div className="flex justify-between items-center text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          0% (Rejected)
        </span>
        <span className="opacity-50 font-mono">threshold: 50%</span>
        <span className="flex items-center gap-1">
          100% (Approved)
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </span>
      </div>
    </div>
  );
}
