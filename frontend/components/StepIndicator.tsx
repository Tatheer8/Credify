"use client";
import { Check, User, DollarSign, Home } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { id: 1, label: "Personal", sublabel: "Applicant Profile", icon: User },
  { id: 2, label: "Financial", sublabel: "Income & Loan", icon: DollarSign },
  { id: 3, label: "Property", sublabel: "Credit & Collateral", icon: Home },
];

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full pb-3 sm:pb-6">
      {/* Mobile Stepper Grid (< 480px) */}
      <div className="grid grid-cols-3 gap-1.5 min-[480px]:hidden">
        {STEPS.map((s) => {
          const isActive = currentStep === s.id;
          const isDone = currentStep > s.id;
          const Icon = s.icon;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => isDone && onStepClick(s.id)}
              disabled={!isDone && !isActive}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-center transition-all ${
                isActive
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-sm"
                  : isDone
                  ? "bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 cursor-pointer hover:bg-emerald-500/10"
                  : "bg-white/[0.02] border border-white/5 text-slate-500 cursor-default"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  isActive
                    ? "bg-emerald-500 text-black font-bold"
                    : isDone
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/5 text-slate-500"
                }`}
              >
                {isDone ? <Check className="w-3 h-3 stroke-[2.5]" /> : <Icon className="w-3 h-3" />}
              </div>
              <span className="text-[11px] font-semibold truncate leading-tight">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tablet & Desktop Linear Stepper (>= 480px) */}
      <div className="hidden min-[480px]:flex items-center justify-between relative">
        {STEPS.map((s, i) => {
          const isActive = currentStep === s.id;
          const isDone = currentStep > s.id;
          const Icon = s.icon;

          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-initial">
              {/* Step circle + labels */}
              <button
                type="button"
                onClick={() => isDone && onStepClick(s.id)}
                disabled={!isDone && !isActive}
                className={`flex items-center gap-2.5 sm:gap-3 transition-all text-left ${
                  isDone ? "cursor-pointer group" : "cursor-default"
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                <div
                  className={`step-dot relative shrink-0 ${
                    isActive ? "active" : isDone ? "done" : "pending"
                  }`}
                >
                  {isDone ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      0{s.id}
                    </span>
                    <p
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        isActive
                          ? "text-emerald-400"
                          : isDone
                          ? "text-emerald-500"
                          : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </p>
                  </div>
                  <p
                    className="text-[11px] hidden md:block truncate"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.sublabel}
                  </p>
                </div>
              </button>

              {/* Connecting progress line */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-4 h-[2px] bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                      width: currentStep > s.id ? "100%" : "0%",
                      background: "linear-gradient(90deg, #10b981, #14b8a6)",
                      boxShadow: currentStep > s.id ? "0 0 8px rgba(16, 185, 129, 0.6)" : "none",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
