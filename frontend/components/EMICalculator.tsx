"use client";
import { useState } from "react";
import { Calculator } from "lucide-react";

interface Props {
  loanAmount:      number;  // in thousands
  loanTerm:        number;  // months
}

const RATES: Record<string, number> = {
  "Fixed 30yr":  8.5,
  "Fixed 15yr":  7.8,
  "Fixed 5yr":   6.9,
  "Variable ARM": 6.2,
};

export default function EMICalculator({ loanAmount, loanTerm }: Props) {
  const [rateKey, setRateKey] = useState("Fixed 30yr");

  const rate         = RATES[rateKey];
  const principal    = loanAmount * 1000;
  const r            = rate / (12 * 100);
  const n            = loanTerm;
  const emi          = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayable = emi * n;
  const totalInterest = totalPayable - principal;

  function fmt(v: number) {
    return v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  return (
    <div className="glass p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5" style={{ color: "var(--brand-400)" }} />
        <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Affordability & EMI Calculator</h3>
      </div>

      {/* Rate selector */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Loan Type / Interest Rate</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(RATES).map(([label, r]) => (
            <button
              key={label}
              onClick={() => setRateKey(label)}
              className="text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: rateKey === label ? "rgba(16,185,129,0.15)" : "var(--bg-elevated)",
                border: `1px solid ${rateKey === label ? "rgba(16,185,129,0.4)" : "var(--border-default)"}`,
                color: rateKey === label ? "var(--brand-400)" : "var(--text-secondary)",
              }}
            >
              <div>{label}</div>
              <div className="text-base font-bold mt-0.5" style={{ color: rateKey === label ? "var(--brand-400)" : "var(--text-primary)" }}>
                {r}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Loan summary */}
      <div className="p-4 rounded-xl space-y-3" style={{ background: "var(--bg-elevated)" }}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Monthly Payment</p>
            <p className="text-3xl font-bold mt-1" style={{ color: "var(--brand-400)" }}>
              ${fmt(emi)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>@ {rate}% APR</p>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              over {n >= 12 ? `${Math.round(n / 12)} years` : `${n} months`}
            </p>
          </div>
        </div>

        {/* Breakdown bar */}
        <div>
          <div className="h-2 rounded-full overflow-hidden flex">
            <div
              className="h-full"
              style={{
                width: `${(principal / totalPayable) * 100}%`,
                background: "linear-gradient(90deg, #059669, #0d9488)"
              }}
            />
            <div className="h-full flex-1" style={{ background: "rgba(239,68,68,0.5)" }} />
          </div>
          <div className="flex justify-between mt-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: "#059669" }} /> Principal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: "rgba(239,68,68,0.6)" }} /> Interest
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          {[
            ["Principal",      `$${fmt(principal)}`,      "var(--brand-400)"],
            ["Total Interest", `$${fmt(totalInterest)}`,  "var(--danger-400)"],
            ["Total Payable",  `$${fmt(totalPayable)}`,   "var(--text-primary)"],
            ["Loan Term",      `${fmt(n)} months`,         "var(--text-secondary)"],
          ].map(([label, val, color]) => (
            <div key={label}>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
              <p className="font-semibold text-sm mt-0.5" style={{ color }}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        * Estimates only. Actual rates and payments may vary based on lender policies.
      </p>
    </div>
  );
}
