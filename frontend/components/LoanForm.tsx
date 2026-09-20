"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, DollarSign, Home, ChevronRight, ChevronLeft, Check } from "lucide-react";
import type { LoanApplication } from "@/lib/api";

const STEPS = [
  { id: 1, label: "Personal",  icon: User },
  { id: 2, label: "Financial", icon: DollarSign },
  { id: 3, label: "Property",  icon: Home },
];

interface Props {
  onSubmit: (data: LoanApplication) => void;
  loading:  boolean;
}

type FormData = {
  Gender:           "Male" | "Female";
  Married:          "Yes" | "No";
  Dependents:       "0" | "1" | "2" | "3+";
  Education:        "Graduate" | "Not Graduate";
  Self_Employed:    "Yes" | "No";
  ApplicantIncome:  string;
  CoapplicantIncome: string;
  LoanAmount:       string;
  Loan_Amount_Term: string;
  Credit_History:   "1" | "0";
  Property_Area:    "Urban" | "Semiurban" | "Rural";
};

const DEFAULT: FormData = {
  Gender: "Male",
  Married: "No",
  Dependents: "0",
  Education: "Graduate",
  Self_Employed: "No",
  ApplicantIncome: "",
  CoapplicantIncome: "0",
  LoanAmount: "",
  Loan_Amount_Term: "360",
  Credit_History: "1",
  Property_Area: "Urban",
};

function SelectField({
  label, id, value, onChange, options, tooltip
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  tooltip?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label htmlFor={id} className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</label>
        {tooltip && (
          <div className="group relative">
            <div className="w-4 h-4 rounded-full text-xs flex items-center justify-center cursor-help font-bold"
              style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>?</div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 text-xs p-2 rounded-lg z-10 hidden group-hover:block"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <select id={id} value={value} onChange={e => onChange(e.target.value)} className="input-base">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function NumericField({
  label, id, value, onChange, placeholder, prefix, tooltip, min
}: {
  label: string; id: string; value: string; placeholder: string;
  onChange: (v: string) => void; prefix?: string; tooltip?: string; min?: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label htmlFor={id} className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</label>
        {tooltip && (
          <div className="group relative">
            <div className="w-4 h-4 rounded-full text-xs flex items-center justify-center cursor-help font-bold"
              style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>?</div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 text-xs p-2 rounded-lg z-10 hidden group-hover:block"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-muted)" }}>{prefix}</span>
        )}
        <input id={id} type="number" min={min ?? 0} value={value}
          onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`input-base ${prefix ? "pl-8" : ""}`} />
      </div>
    </div>
  );
}

export default function LoanForm({ onSubmit, loading }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(DEFAULT);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function validateStep(s: number): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (s === 2) {
      if (!form.ApplicantIncome || Number(form.ApplicantIncome) <= 0) errs.ApplicantIncome = "Required";
      if (!form.LoanAmount || Number(form.LoanAmount) <= 0) errs.LoanAmount = "Required";
      if (!form.Loan_Amount_Term || Number(form.Loan_Amount_Term) <= 0) errs.Loan_Amount_Term = "Required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function nextStep() {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 3));
  }
  function prevStep() { setStep(s => Math.max(s - 1, 1)); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(step)) return;
    onSubmit({
      Gender:           form.Gender,
      Married:          form.Married,
      Dependents:       form.Dependents,
      Education:        form.Education,
      Self_Employed:    form.Self_Employed,
      ApplicantIncome:  Number(form.ApplicantIncome),
      CoapplicantIncome: Number(form.CoapplicantIncome),
      LoanAmount:       Number(form.LoanAmount),
      Loan_Amount_Term: Number(form.Loan_Amount_Term),
      Credit_History:   Number(form.Credit_History) as 0 | 1,
      Property_Area:    form.Property_Area,
    });
  }

  return (
    <div className="glass p-6 space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <button
              onClick={() => step > s.id && setStep(s.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer flex-1"
            >
              <div className={`step-dot ${step === s.id ? "active" : step > s.id ? "done" : "pending"}`}>
                {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
              </div>
              <span className="text-xs font-medium hidden sm:block" style={{
                color: step === s.id ? "var(--brand-400)" : step > s.id ? "var(--success-400)" : "var(--text-muted)"
              }}>{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className="h-px flex-1 mb-4 transition-all duration-500"
                style={{ background: step > s.id ? "var(--success-500)" : "var(--border-default)" }} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* ── Step 1: Personal ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Gender" id="field-gender" value={form.Gender}
                  onChange={v => set("Gender", v as FormData["Gender"])}
                  options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]} />
                <SelectField label="Marital Status" id="field-married" value={form.Married}
                  onChange={v => set("Married", v as FormData["Married"])}
                  options={[{ value: "No", label: "Single" }, { value: "Yes", label: "Married" }]} />
                <SelectField label="Dependents" id="field-dependents" value={form.Dependents}
                  onChange={v => set("Dependents", v as FormData["Dependents"])}
                  tooltip="Number of people financially dependent on you"
                  options={[
                    { value: "0", label: "None" }, { value: "1", label: "1 person" },
                    { value: "2", label: "2 people" }, { value: "3+", label: "3 or more" }
                  ]} />
                <SelectField label="Education" id="field-education" value={form.Education}
                  onChange={v => set("Education", v as FormData["Education"])}
                  options={[{ value: "Graduate", label: "Graduate" }, { value: "Not Graduate", label: "Not Graduate" }]} />
                <SelectField label="Self Employed" id="field-self-employed" value={form.Self_Employed}
                  onChange={v => set("Self_Employed", v as FormData["Self_Employed"])}
                  tooltip="Are you your own employer / run your own business?"
                  options={[{ value: "No", label: "No — Employed" }, { value: "Yes", label: "Yes — Self-employed" }]} />
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Financial ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Financial Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumericField label="Applicant Income ($/mo)" id="field-income" value={form.ApplicantIncome}
                  onChange={v => set("ApplicantIncome", v)} placeholder="e.g. 5000" prefix="$" min={1}
                  tooltip="Your gross monthly income before taxes" />
                <NumericField label="Co-applicant Income ($/mo)" id="field-coincome" value={form.CoapplicantIncome}
                  onChange={v => set("CoapplicantIncome", v)} placeholder="0" prefix="$"
                  tooltip="Spouse/co-borrower monthly income (enter 0 if none)" />
                <NumericField label="Loan Amount ($K)" id="field-loanamt" value={form.LoanAmount}
                  onChange={v => set("LoanAmount", v)} placeholder="e.g. 120" prefix="$" min={1}
                  tooltip="Requested loan amount in thousands of dollars" />
                <NumericField label="Loan Term (months)" id="field-term" value={form.Loan_Amount_Term}
                  onChange={v => set("Loan_Amount_Term", v)} placeholder="360" min={12}
                  tooltip="Repayment duration. 360 months = 30 years" />
              </div>
              {/* Inline field errors */}
              {Object.values(errors).some(Boolean) && (
                <p className="text-sm" style={{ color: "var(--danger-400)" }}>Please fill all required fields.</p>
              )}
            </motion.div>
          )}

          {/* ── Step 3: Credit & Property ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Credit & Property</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Credit History" id="field-credit" value={form.Credit_History}
                  onChange={v => set("Credit_History", v as "0" | "1")}
                  tooltip="Have you consistently met past debt obligations?"
                  options={[
                    { value: "1", label: "✓ Good — Meets guidelines" },
                    { value: "0", label: "✗ Poor — Does not meet guidelines" }
                  ]} />
                <SelectField label="Property Area" id="field-area" value={form.Property_Area}
                  onChange={v => set("Property_Area", v as FormData["Property_Area"])}
                  tooltip="Location classification of the property to be purchased"
                  options={[
                    { value: "Urban", label: "Urban" },
                    { value: "Semiurban", label: "Semi-Urban" },
                    { value: "Rural", label: "Rural" }
                  ]} />
              </div>

              {/* Summary preview */}
              <div className="mt-4 p-4 rounded-xl space-y-2" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Application Summary</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                  {[
                    ["Income",    `$${Number(form.ApplicantIncome).toLocaleString()}/mo`],
                    ["Loan",      `$${Number(form.LoanAmount)}K`],
                    ["Term",      `${form.Loan_Amount_Term} mo`],
                    ["Education", form.Education],
                    ["Employment",form.Self_Employed === "Yes" ? "Self-employed" : "Employed"],
                    ["Area",      form.Property_Area],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span style={{ color: "var(--text-muted)" }}>{k}</span>
                      <span className="font-medium" style={{ color: "var(--text-primary)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 pt-6 mt-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          {step > 1 && (
            <button type="button" onClick={prevStep}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}>
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <button type="button" onClick={nextStep}
              className="btn-primary flex items-center gap-1.5">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" disabled={loading} id="predict-btn"
              className="btn-primary flex items-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Analyzing…
                </>
              ) : "Get Prediction"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
