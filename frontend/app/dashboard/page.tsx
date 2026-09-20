"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Activity,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import StepIndicator from "@/components/StepIndicator";
import PersonalForm from "@/components/PersonalForm";
import FinancialForm from "@/components/FinancialForm";
import PropertyForm from "@/components/PropertyForm";
import PredictionCard from "@/components/PredictionCard";
import ModelTransparency from "@/components/ModelTransparency";
import Toast from "@/components/Toast";
import {
  predictLoan,
  getSessionCount,
} from "@/lib/predictionService";
import type { LoanFormData, PredictionResult, ToastMessage } from "@/lib/types";

const INITIAL_FORM_DATA: LoanFormData = {
  applicantName: "Fatima Zahra",
  age: "32",
  education: "Graduate",
  employment: "Employed",
  dependents: "0",
  maritalStatus: "Single",
  income: "6200",
  coApplicantIncome: "1800",
  loanAmount: "150",
  loanTerm: "360",
  creditHistory: "Good",
  propertyArea: "Semiurban",
};

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LoanFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LoanFormData, string>>>({});
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionCount, setSessionCount] = useState(14);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    setSessionCount(getSessionCount());
  }, []);

  function addToast(type: ToastMessage["type"], message: string) {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function handleFieldChange<K extends keyof LoanFormData>(key: K, value: LoanFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  // Multi-step validation
  function validateStep(step: number): boolean {
    const errors: Partial<Record<keyof LoanFormData, string>> = {};

    if (step === 1) {
      if (!formData.applicantName.trim()) {
        errors.applicantName = "Applicant name is required";
      }
      const ageNum = Number(formData.age);
      if (!formData.age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        errors.age = "Please enter a valid age (18 - 100)";
      }
    } else if (step === 2) {
      const incomeNum = Number(formData.income);
      if (!formData.income || isNaN(incomeNum) || incomeNum <= 0) {
        errors.income = "Please enter valid monthly income ($)";
      }
      const loanNum = Number(formData.loanAmount);
      if (!formData.loanAmount || isNaN(loanNum) || loanNum <= 0) {
        errors.loanAmount = "Please enter loan amount ($K)";
      }
      if (!formData.loanTerm) {
        errors.loanTerm = "Please select loan term";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleNextStep() {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } else {
      addToast("error", "Please correct the highlighted fields before continuing.");
    }
  }

  function handlePrevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  async function handleGetPrediction() {
    if (!validateStep(1) || !validateStep(2)) {
      addToast("error", "Please ensure all steps are valid before predicting.");
      return;
    }

    setLoading(true);
    try {
      const res = await predictLoan(formData);
      setPredictionResult(res);
      setSessionCount(getSessionCount());
      addToast(
        "success",
        `Assessment complete! Verdict: ${res.prediction} (${Math.round(res.confidence * 100)}% confidence)`
      );
    } catch (err: unknown) {
      addToast("error", "Failed to run prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFormData({
      applicantName: "",
      age: "30",
      education: "Graduate",
      employment: "Employed",
      dependents: "0",
      maritalStatus: "Single",
      income: "5000",
      coApplicantIncome: "0",
      loanAmount: "120",
      loanTerm: "360",
      creditHistory: "Good",
      propertyArea: "Urban",
    });
    setFormErrors({});
    setPredictionResult(null);
    setCurrentStep(1);
    addToast("info", "Form reset. Ready for a new assessment.");
  }

  return (
    <div className="space-y-8">
      {/* Toast feedback system */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Main Page Heading */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40 shrink-0"
            style={{ background: "linear-gradient(135deg, #059669, #0d9488)" }}
          >
            <Brain className="w-6 h-6 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1
                className="text-2xl sm:text-3xl font-extrabold tracking-tight gradient-heading"
                style={{ fontFamily: "var(--font-space), sans-serif" }}
              >
                Loan Assessment Dashboard
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden md:inline-block">
                Production KNN
              </span>
            </div>
            <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              AI-powered loan eligibility analysis using K-Nearest Neighbors
            </p>
          </div>
        </div>

        {/* New Assessment Shortcut when result is present */}
        {predictionResult && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer hover:border-emerald-500/40 shrink-0"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Assessment</span>
          </motion.button>
        )}
      </motion.div>

      {/* Three Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <StatCard
          icon={Brain}
          label="Model"
          value="KNN Classifier"
          subtext="k = 11 • Euclidean Metric"
          color="#10b981"
          delay={0.05}
        />
        <StatCard
          icon={TrendingUp}
          label="Accuracy"
          value="86.2%"
          subtext="F1: 90.8% • Recall: 98.8%"
          color="#14b8a6"
          delay={0.1}
        />
        <StatCard
          icon={Activity}
          label="Sessions Run"
          value={sessionCount}
          subtext="Real-time session audit"
          color="#06b6d4"
          delay={0.15}
        />
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Multi-Step Application Form (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass p-6 sm:p-8 space-y-6">
            {/* Step Indicator Header */}
            <StepIndicator
              currentStep={currentStep}
              onStepClick={(s) => setCurrentStep(s)}
            />

            {/* Dynamic Step Content with AnimatePresence */}
            <form onSubmit={(e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <PersonalForm
                      data={formData}
                      onChange={handleFieldChange}
                      errors={formErrors}
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <FinancialForm
                      data={formData}
                      onChange={handleFieldChange}
                      errors={formErrors}
                    />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <PropertyForm
                      data={formData}
                      onChange={handleFieldChange}
                      errors={formErrors}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Navigation Controls */}
              <div
                className="flex items-center justify-between pt-6 mt-6 border-t"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-secondary flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-primary flex items-center gap-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="get-prediction-btn"
                    type="button"
                    disabled={loading}
                    onClick={handleGetPrediction}
                    className="btn-primary flex items-center gap-2 px-6 py-3 text-sm sm:text-base font-bold shadow-xl"
                    style={{
                      background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                      boxShadow: "0 4px 25px rgba(16, 185, 129, 0.45)",
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Running KNN Model…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Get Prediction</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Prediction Result Panel (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          <PredictionCard
            data={formData}
            result={predictionResult}
            loading={loading}
            onReset={handleReset}
            onExportSuccess={() => addToast("success", "Assessment PDF downloaded successfully!")}
          />
        </div>
      </div>

      {/* Collapsible Model Transparency Section */}
      <div className="pt-2">
        <ModelTransparency />
      </div>
    </div>
  );
}
