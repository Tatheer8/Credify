"use client";
import { useState } from "react";
import { DollarSign, Clock, HelpCircle, TrendingUp } from "lucide-react";
import type { LoanFormData } from "@/lib/types";

interface FinancialFormProps {
  data: LoanFormData;
  onChange: <K extends keyof LoanFormData>(key: K, value: LoanFormData[K]) => void;
  errors: Partial<Record<keyof LoanFormData, string>>;
}

interface TooltipProps {
  text: string;
}

function Tooltip({ text }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        className="text-slate-400 hover:text-emerald-400 focus:outline-none transition-colors ml-1 p-0.5"
        aria-label="More information"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 rounded-xl text-xs z-30 shadow-xl pointer-events-none"
          style={{
            background: "rgba(15, 26, 38, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
          }}
        >
          {text}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
            style={{ borderTopColor: "rgba(15, 26, 38, 0.95)" }}
          />
        </div>
      )}
    </div>
  );
}

export default function FinancialForm({ data, onChange, errors }: FinancialFormProps) {
  return (
    <div className="space-y-4">
      <div className="border-b pb-3" style={{ borderColor: "var(--border-subtle)" }}>
        <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          Financial Profile
        </h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Income streams, loan parameters, and requested amortization term
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Applicant Income */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="income" className="text-xs font-semibold flex items-center" style={{ color: "var(--text-secondary)" }}>
              Applicant Income ($/mo)
              <Tooltip text="Gross primary monthly salary or net business receipts before tax deductions." />
            </label>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              $
            </span>
            <input
              id="income"
              type="number"
              min={1}
              value={data.income}
              onChange={(e) => onChange("income", e.target.value)}
              placeholder="e.g. 5800"
              className="input-base pl-8"
            />
          </div>
          {errors.income && (
            <p className="text-[11px] text-red-400">{errors.income}</p>
          )}
        </div>

        {/* Co-applicant Income */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="coApplicantIncome" className="text-xs font-semibold flex items-center" style={{ color: "var(--text-secondary)" }}>
              Co-applicant Income ($/mo)
              <Tooltip text="Secondary co-borrower monthly income (e.g. spouse, partner). Enter 0 if no co-applicant." />
            </label>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              $
            </span>
            <input
              id="coApplicantIncome"
              type="number"
              min={0}
              value={data.coApplicantIncome}
              onChange={(e) => onChange("coApplicantIncome", e.target.value)}
              placeholder="0"
              className="input-base pl-8"
            />
          </div>
        </div>

        {/* Loan Amount */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="loanAmount" className="text-xs font-semibold flex items-center" style={{ color: "var(--text-secondary)" }}>
              Loan Amount ($K)
              <Tooltip text="Total principal requested in thousands of dollars (e.g. 150 = $150,000 USD)." />
            </label>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              $
            </span>
            <input
              id="loanAmount"
              type="number"
              min={1}
              value={data.loanAmount}
              onChange={(e) => onChange("loanAmount", e.target.value)}
              placeholder="e.g. 140"
              className="input-base pl-8"
            />
          </div>
          {errors.loanAmount && (
            <p className="text-[11px] text-red-400">{errors.loanAmount}</p>
          )}
        </div>

        {/* Loan Term */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="loanTerm" className="text-xs font-semibold flex items-center" style={{ color: "var(--text-secondary)" }}>
              Loan Term (months)
              <Tooltip text="Amortization duration in months. Standard 30 years = 360 months; 15 years = 180 months." />
            </label>
          </div>
          <select
            id="loanTerm"
            value={data.loanTerm}
            onChange={(e) => onChange("loanTerm", e.target.value)}
            className="input-base"
          >
            <option value="120">120 months (10 Years)</option>
            <option value="180">180 months (15 Years)</option>
            <option value="240">240 months (20 Years)</option>
            <option value="300">300 months (25 Years)</option>
            <option value="360">360 months (30 Years — Standard)</option>
            <option value="480">480 months (40 Years)</option>
          </select>
          {errors.loanTerm && (
            <p className="text-[11px] text-red-400">{errors.loanTerm}</p>
          )}
        </div>
      </div>
    </div>
  );
}
