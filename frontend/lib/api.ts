// lib/api.ts — FastAPI client

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface LoanApplication {
  Gender:             "Male" | "Female";
  Married:            "Yes" | "No";
  Dependents:         "0" | "1" | "2" | "3+";
  Education:          "Graduate" | "Not Graduate";
  Self_Employed:      "Yes" | "No";
  ApplicantIncome:    number;
  CoapplicantIncome:  number;
  LoanAmount:         number;
  Loan_Amount_Term:   number;
  Credit_History:     0 | 1;
  Property_Area:      "Urban" | "Semiurban" | "Rural";
}

export interface KeyFactor {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  detail: string;
}

export interface PredictionResult {
  status:           "Approved" | "Rejected";
  confidence_score: number;
  key_factors:      KeyFactor[];
  emi_estimate:     number;
}

export interface ConfusionMatrix {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
}

export interface ModelMetrics {
  accuracy:         number;
  precision:        number;
  recall:           number;
  f1_score:         number;
  optimal_k:        number;
  best_metric:      string;
  confusion_matrix: ConfusionMatrix;
  training_size:    number;
  test_size:        number;
  feature_count:    number;
  cv_results:       Array<{ k: number; metric: string; mean_f1: number; std_f1: number }>;
}

export async function predict(data: LoanApplication): Promise<PredictionResult> {
  const res = await fetch(`${API_BASE}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail ?? "Prediction failed");
  }
  return res.json();
}

export async function getMetrics(): Promise<ModelMetrics> {
  const res = await fetch(`${API_BASE}/api/metrics`);
  if (!res.ok) throw new Error("Failed to load model metrics");
  return res.json();
}
