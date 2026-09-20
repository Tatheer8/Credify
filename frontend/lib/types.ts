// frontend/lib/types.ts — CrediWise AI Type Definitions

export type Gender = "Male" | "Female";
export type MaritalStatus = "Single" | "Married";
export type Dependents = "0" | "1" | "2" | "3+";
export type Education = "Graduate" | "Not Graduate";
export type EmploymentStatus = "Employed" | "Self-employed";
export type CreditHistory = "Good" | "Poor";
export type PropertyArea = "Urban" | "Semiurban" | "Rural";

export interface LoanFormData {
  applicantName: string;
  age: string;
  education: Education;
  employment: EmploymentStatus;
  dependents: Dependents;
  maritalStatus: MaritalStatus;
  income: string;
  coApplicantIncome: string;
  loanAmount: string;
  loanTerm: string;
  creditHistory: CreditHistory;
  propertyArea: PropertyArea;
}

export interface DecisionFactor {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  detail: string;
}

export interface PredictionResult {
  prediction: "Approved" | "Rejected";
  confidence: number; // 0 to 1
  estimatedEMI: number; // monthly EMI in USD
  factors: DecisionFactor[];
  debtToIncomeRatio: number;
  totalIncome: number;
  assessedAt: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  optimal_k: number;
  best_metric: string;
  training_size: number;
  test_size: number;
  feature_count: number;
  confusion_matrix: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
  cv_results: Array<{
    k: number;
    metric: string;
    mean_f1: number;
    std_f1: number;
  }>;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}
