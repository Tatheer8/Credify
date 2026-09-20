"use client";
import { CheckCircle2, DollarSign, Calendar, Landmark, Briefcase, GraduationCap } from "lucide-react";
import type { LoanFormData } from "@/lib/types";

interface ApplicationSummaryProps {
  data: LoanFormData;
}

export default function ApplicationSummary({ data }: ApplicationSummaryProps) {
  const incomeNum = Number(data.income) || 0;
  const coIncomeNum = Number(data.coApplicantIncome) || 0;
  const loanNum = Number(data.loanAmount) || 0;
  const totalIncome = incomeNum + coIncomeNum;

  const items = [
    {
      label: "Income",
      value: `$${incomeNum.toLocaleString()}/mo ${coIncomeNum > 0 ? `(+ $${coIncomeNum.toLocaleString()})` : ""}`,
      icon: DollarSign,
      color: "#10b981",
    },
    {
      label: "Loan Amount",
      value: `$${loanNum.toLocaleString()}K ($${(loanNum * 1000).toLocaleString()})`,
      icon: Landmark,
      color: "#14b8a6",
    },
    {
      label: "Loan Term",
      value: `${data.loanTerm} months (${(Number(data.loanTerm) / 12).toFixed(0)} yrs)`,
      icon: Calendar,
      color: "#06b6d4",
    },
    {
      label: "Education",
      value: data.education,
      icon: GraduationCap,
      color: "#34d399",
    },
    {
      label: "Employment",
      value: data.employment,
      icon: Briefcase,
      color: "#2dd4bf",
    },
    {
      label: "Property Area",
      value: data.propertyArea,
      icon: Landmark,
      color: "#38bdf8",
    },
  ];

  return (
    <div
      className="p-4 sm:p-5 rounded-2xl space-y-3 transition-all duration-200"
      style={{
        background: "rgba(15, 26, 38, 0.7)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Application Summary
        </p>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Ready for ML Review
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs sm:text-sm">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: item.color }} />
                {item.label}
              </span>
              <span className="font-semibold text-right truncate pl-2" style={{ color: "var(--text-primary)" }}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
