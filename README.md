# CrediWise AI — Intelligent Loan Assessment Platform

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-KNN-orange.svg)](https://scikit-learn.org/)

**CrediWise AI** is a modern, recruiter-ready FinTech web application for automated credit risk underwriting. Built with a dark obsidian & emerald aesthetic, it leverages a K-Nearest Neighbors (KNN) machine learning classifier trained on benchmark loan application datasets to deliver instant approval predictions, confidence intervals, estimated amortization EMIs, and explainable decision factors.

---

## 🌟 Key Features

### 1. Executive FinTech Dashboard
- **Color Palette & Theme**: Deep obsidian / dark navy (`#05090e`), vibrant emerald accents (`#10b981`), teal highlights (`#14b8a6`), glassmorphic panels, and glowing card borders.
- **Theme Toggle**: Seamless switching between Dark FinTech and Light Clean modes with state persistence.
- **User Profile**: Active underwriter session pre-configured for **Fatima** with an avatar badge and session logout.
- **Real-Time Stat Cards**:
  - **Model**: KNN Classifier ($k=11$, Euclidean distance metric)
  - **Accuracy**: $86.2\%$ benchmark accuracy ($F_1: 90.8\%$, Recall: $98.8\%$)
  - **Sessions Run**: Dynamically tracked and persisted across assessments.

### 2. Multi-Step Loan Application Workflow
- **Step 1 — Personal Information**: Applicant Name, Age, Education, Employment Status, Dependents, Marital Status.
- **Step 2 — Financial Profile**: Applicant Income ($/mo), Co-applicant Income ($/mo), Loan Amount ($K), Loan Term (months) with inline tooltips explaining underwriting criteria.
- **Step 3 — Credit & Property**: Credit History (Good / Poor guidelines), Property Area (Urban, Semiurban, Rural), and an integrated real-time **Application Summary** preview card.

### 3. Dynamic Prediction Engine & Results
- **Dual-Mode Inference**:
  - Automatically queries the FastAPI backend at `http://localhost:8000/api/predict` when active.
  - Seamlessly falls back to a standalone, client-side KNN scoring algorithm using weighted feature vectors (Credit History $38\%$, DTI $24\%$, Total Income $16\%$, Loan Term $9\%$, Property Area $7\%$) so the app works standalone without crashing.
- **Approval / Rejection Verdict**:
  - **Approved**: Animated glowing green checkmark, "Approved" badge, and eligibility confirmation.
  - **Rejected**: Glowing warning alert, "Rejected" badge, and risk rationale.
- **Dynamic Confidence Gauge**: Horizontal progress bar visualizing approval odds from $0\%$ (Rejected) to $100\%$ (Approved).
- **Estimated Monthly EMI**: Exact financial amortization calculation: $EMI = \frac{P \cdot r \cdot (1+r)^n}{(1+r)^n - 1}$.
- **Key Decision Factors**: Bulleted breakdown of positive, neutral, and adverse factors influencing the algorithmic verdict.

### 4. Model Transparency & Recharts Visualizations
A collapsible audit panel providing full explainability for credit committee review:
- **Benchmark Metrics**: Accuracy ($86.2\%$), Precision ($84.0\%$), Recall ($98.8\%$), and $F_1$ Score ($90.8\%$).
- **Recharts Visualizations**:
  1. **Confusion Matrix**: Visual 2x2 grid and bar chart breakdown ($TN: 22$, $FP: 16$, $FN: 1$, $TP: 84$).
  2. **Prediction Distribution**: Interactive pie chart displaying historical class balance.
  3. **Feature Importance**: Horizontal bar chart mapping relative weights of credit, income, and collateral vectors.

### 5. Assessment Export (PDF Generation)
- Generates a PDF loan memo using `html2canvas` and `jsPDF`.
- Includes underwriter signoff, applicant demographics, financial ratios, verdict badge, confidence score, EMI amortization, and key decision factors.

### 6. New Assessment Reset
- Resets the multi-step form to Step 1, clears input validation errors, and increments the session audit counter.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (Turbopack), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Vanilla CSS Glassmorphism
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **PDF Export**: jsPDF + html2canvas
- **Backend (Optional)**: Python 3.10+, FastAPI, Uvicorn, Scikit-Learn, Joblib, NumPy, Pandas

---

## 🚀 Quick Start Guide

### 1. Start the Frontend
```powershell
# From the project root:
.\start_frontend.ps1
# or manually:
cd frontend
npm.cmd run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The app automatically redirects to `/dashboard`.

### 2. (Optional) Start the FastAPI Backend
```powershell
# In a separate terminal from project root:
.\start_backend.ps1
# or manually:
uvicorn backend.main:app --reload --port 8000
```
Swagger API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).
*(Note: If the backend is not started, CrediWise AI automatically runs in demo mode using its high-fidelity client KNN heuristic engine.)*

---

## 📁 Repository Structure

```
Credify/
├── backend/
│   ├── main.py                  # FastAPI REST API endpoints
│   ├── schemas.py               # Pydantic schemas & normalized aliases
│   └── __init__.py
├── artifacts/
│   ├── loan_knn_model.pkl       # Trained KNN scikit-learn model
│   ├── scaler.pkl               # Standard scaler
│   └── model_metrics.json       # Benchmark metrics (Accuracy 86.2%)
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # CrediWise metadata & fonts
│   │   ├── page.tsx             # Root redirect to /dashboard
│   │   ├── globals.css          # Dark FinTech theme & mesh background
│   │   ├── dashboard/
│   │   │   ├── layout.tsx       # Header integration & theme toggle
│   │   │   └── page.tsx         # 2-column responsive dashboard
│   ├── components/
│   │   ├── Header.tsx           # Sticky nav with Fatima profile & logout
│   │   ├── StatCard.tsx         # Model, Accuracy & Session stat cards
│   │   ├── StepIndicator.tsx    # 3-step progress navigation
│   │   ├── PersonalForm.tsx     # Step 1: Applicant info
│   │   ├── FinancialForm.tsx    # Step 2: Incomes & loan term
│   │   ├── PropertyForm.tsx     # Step 3: Credit & collateral
│   │   ├── ApplicationSummary.tsx # Embedded preview summary
│   │   ├── PredictionCard.tsx   # Pre/Post prediction verdict card
│   │   ├── ConfidenceBar.tsx    # Dynamic 0-100% confidence gauge
│   │   ├── DecisionFactors.tsx  # Key algorithmic decision drivers
│   │   ├── ConfusionMatrix.tsx  # 2x2 confusion matrix grid
│   │   ├── TransparencyCharts.tsx # Recharts analytics suite
│   │   ├── ModelTransparency.tsx # Collapsible model metrics accordion
│   │   ├── AssessmentExport.tsx # Executive PDF export generator
│   │   └── Toast.tsx            # Floating action notifications
│   ├── lib/
│   │   ├── auth.ts              # Session utilities initialized with Fatima
│   │   ├── predictionService.ts # Dual-mode prediction service & metrics
│   │   └── types.ts             # Shared TypeScript interfaces
│   └── package.json
├── ml_pipeline.py               # Model training & evaluation pipeline
├── start_backend.ps1            # Backend launch script
└── start_frontend.ps1           # Frontend launch script
```

---

## 📜 Compliance & Ethics
CrediWise AI is designed following explainable AI (XAI) principles. Every automated decision is backed by human-readable decision factors and a complete breakdown of model parameters.
