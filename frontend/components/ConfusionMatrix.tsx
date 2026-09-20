"use client";

interface ConfusionMatrixProps {
  matrix: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
}

export default function ConfusionMatrix({ matrix }: ConfusionMatrixProps) {
  const total = matrix.tn + matrix.fp + matrix.fn + matrix.tp;
  const correct = matrix.tn + matrix.tp;
  const accuracyPct = ((correct / total) * 100).toFixed(1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Confusion Matrix (Test Split: N={total})
        </p>
        <span className="text-xs font-semibold text-emerald-400">
          Accuracy: {accuracyPct}%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        {/* Row 0 Header */}
        <div className="flex items-end justify-center pb-1 text-[11px] font-medium text-slate-500">
          Ground Truth
        </div>
        <div className="text-center font-bold pb-1 text-slate-300">
          Pred. Rejected (0)
        </div>
        <div className="text-center font-bold pb-1 text-slate-300">
          Pred. Approved (1)
        </div>

        {/* Row 1: Actual Rejected */}
        <div className="font-semibold flex items-center pr-2 text-slate-400 text-[11px]">
          Actual Rejected (0)
        </div>
        <div
          className="p-3 rounded-xl text-center font-black transition-all hover:scale-[1.02]"
          style={{
            background: "rgba(16, 185, 129, 0.14)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            color: "#34d399",
          }}
        >
          <span className="text-base sm:text-lg block font-mono">{matrix.tn}</span>
          <span className="text-[10px] font-normal uppercase tracking-wider opacity-80">True Negative (TN)</span>
        </div>
        <div
          className="p-3 rounded-xl text-center font-black transition-all hover:scale-[1.02]"
          style={{
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
          }}
        >
          <span className="text-base sm:text-lg block font-mono">{matrix.fp}</span>
          <span className="text-[10px] font-normal uppercase tracking-wider opacity-80">False Positive (FP)</span>
        </div>

        {/* Row 2: Actual Approved */}
        <div className="font-semibold flex items-center pr-2 text-slate-400 text-[11px]">
          Actual Approved (1)
        </div>
        <div
          className="p-3 rounded-xl text-center font-black transition-all hover:scale-[1.02]"
          style={{
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
          }}
        >
          <span className="text-base sm:text-lg block font-mono">{matrix.fn}</span>
          <span className="text-[10px] font-normal uppercase tracking-wider opacity-80">False Negative (FN)</span>
        </div>
        <div
          className="p-3 rounded-xl text-center font-black transition-all hover:scale-[1.02]"
          style={{
            background: "rgba(16, 185, 129, 0.18)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "#34d399",
          }}
        >
          <span className="text-base sm:text-lg block font-mono">{matrix.tp}</span>
          <span className="text-[10px] font-normal uppercase tracking-wider opacity-80">True Positive (TP)</span>
        </div>
      </div>
    </div>
  );
}
