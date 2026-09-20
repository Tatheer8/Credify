"""
CrediWise AI — FastAPI Backend
==============================
Run: uvicorn backend.main:app --reload --port 8000
"""

import os
import json
import math
import numpy as np
import joblib
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.schemas import (
    LoanApplicationRequest, PredictionResponse,
    KeyFactor, MetricsResponse, ConfusionMatrix
)

# ─────────────────────────────────────────────────────────
# Paths
# ─────────────────────────────────────────────────────────
BASE_DIR     = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTIFACT_DIR = os.path.join(BASE_DIR, "artifacts")
MODEL_PATH   = os.path.join(ARTIFACT_DIR, "loan_knn_model.pkl")
SCALER_PATH  = os.path.join(ARTIFACT_DIR, "scaler.pkl")
META_PATH    = os.path.join(ARTIFACT_DIR, "model_metadata.json")
METRICS_PATH = os.path.join(ARTIFACT_DIR, "model_metrics.json")

# ─────────────────────────────────────────────────────────
# Global state loaded at startup
# ─────────────────────────────────────────────────────────
app_state: dict = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML artifacts on startup."""
    print("[startup] Loading CrediWise AI ML artifacts …")
    bundle       = joblib.load(MODEL_PATH)
    app_state["model"]        = bundle["model"]
    app_state["feature_cols"] = bundle["feature_cols"]
    app_state["scaler"]       = joblib.load(SCALER_PATH)

    with open(META_PATH)    as f: app_state["encoders"] = json.load(f)["encoders"]
    with open(METRICS_PATH) as f: app_state["metrics"]  = json.load(f)

    print(f"[startup] CrediWise Model loaded — optimal k={app_state['model'].n_neighbors}")
    yield
    app_state.clear()


# ─────────────────────────────────────────────────────────
# App
# ─────────────────────────────────────────────────────────
app = FastAPI(
    title="CrediWise AI API",
    description="KNN-based Loan Assessment & Risk Predictor",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────
ENCODING_MAP = {
    "Gender":        {"Male": 1, "Female": 0},
    "Married":       {"Yes": 1, "No": 0},
    "Dependents":    {"0": 0, "1": 1, "2": 2, "3+": 3},
    "Education":     {"Graduate": 0, "Not Graduate": 1},
    "Self_Employed": {"Yes": 1, "No": 0},
    "Property_Area": {"Rural": 0, "Semiurban": 1, "Urban": 2},
}


def encode_input(req: LoanApplicationRequest) -> dict:
    return {
        "Gender":            ENCODING_MAP["Gender"][req.Gender],
        "Married":           ENCODING_MAP["Married"][req.Married],
        "Dependents":        ENCODING_MAP["Dependents"][req.Dependents],
        "Education":         ENCODING_MAP["Education"][req.Education],
        "Self_Employed":     ENCODING_MAP["Self_Employed"][req.Self_Employed],
        "ApplicantIncome":   req.ApplicantIncome,
        "CoapplicantIncome": req.CoapplicantIncome,
        "LoanAmount":        req.LoanAmount,
        "Loan_Amount_Term":  req.Loan_Amount_Term,
        "Credit_History":    req.Credit_History,
        "Property_Area":     ENCODING_MAP["Property_Area"][req.Property_Area],
        "Total_Income":      req.ApplicantIncome + req.CoapplicantIncome,
        "EMI":               req.LoanAmount / req.Loan_Amount_Term,
        "log_LoanAmount":    math.log1p(req.LoanAmount),
        "log_Total_Income":  math.log1p(req.ApplicantIncome + req.CoapplicantIncome),
        "Debt_to_Income":    req.LoanAmount / (req.ApplicantIncome + req.CoapplicantIncome + 1),
    }


def build_key_factors(req: LoanApplicationRequest, label: int) -> list[KeyFactor]:
    factors = []
    total_income = req.ApplicantIncome + req.CoapplicantIncome
    dti          = req.LoanAmount / (total_income + 1)
    emi          = req.LoanAmount / req.Loan_Amount_Term

    # Credit history — strongest signal
    if req.Credit_History == 1:
        factors.append(KeyFactor(
            factor="Credit History",
            impact="positive",
            detail="Good credit history is the strongest approval signal."
        ))
    else:
        factors.append(KeyFactor(
            factor="Credit History",
            impact="negative",
            detail="No or poor credit history significantly reduces approval odds."
        ))

    # Debt-to-Income ratio
    if dti < 0.3:
        factors.append(KeyFactor(
            factor="Debt-to-Income Ratio",
            impact="positive",
            detail=f"Low DTI ({dti:.2f}) — loan amount is manageable relative to income."
        ))
    elif dti > 0.6:
        factors.append(KeyFactor(
            factor="Debt-to-Income Ratio",
            impact="negative",
            detail=f"High DTI ({dti:.2f}) — loan burden may be too high for income level."
        ))
    else:
        factors.append(KeyFactor(
            factor="Debt-to-Income Ratio",
            impact="neutral",
            detail=f"Moderate DTI ({dti:.2f}) — within acceptable range."
        ))

    # Property area
    area_impact = {"Urban": "positive", "Semiurban": "positive", "Rural": "neutral"}
    area_detail = {
        "Urban": "Urban properties generally have better resale value.",
        "Semiurban": "Semiurban areas often have favorable loan rates.",
        "Rural": "Rural properties may require additional documentation."
    }
    factors.append(KeyFactor(
        factor="Property Area",
        impact=area_impact[req.Property_Area],
        detail=area_detail[req.Property_Area]
    ))

    # Employment & co-applicant
    if req.CoapplicantIncome > 0:
        factors.append(KeyFactor(
            factor="Co-applicant Income",
            impact="positive",
            detail=f"Co-applicant income (${req.CoapplicantIncome:,.0f}) strengthens repayment capacity."
        ))

    if req.Self_Employed == "Yes":
        factors.append(KeyFactor(
            factor="Self Employment",
            impact="neutral",
            detail="Self-employment may require additional income documentation."
        ))

    # Education
    if req.Education == "Graduate":
        factors.append(KeyFactor(
            factor="Education",
            impact="positive",
            detail="Graduate status correlates with stable employment and income."
        ))

    return factors


def estimate_emi(loan_amount: float, term_months: float, annual_rate: float = 8.5) -> float:
    """EMI = P × r × (1+r)^n / ((1+r)^n - 1)"""
    p = loan_amount * 1000   # LoanAmount is in thousands
    r = annual_rate / (12 * 100)
    n = term_months
    if r == 0:
        return p / n
    emi = p * r * (1 + r)**n / ((1 + r)**n - 1)
    return round(emi, 2)


# ─────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"message": "CrediWise AI API is running", "status": "ok"}


@app.post("/api/logout", tags=["Auth"])
def logout():
    """Invalidate session / refresh tokens on logout."""
    return {"status": "ok", "message": "Session invalidated successfully"}


@app.post("/api/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(req: LoanApplicationRequest):
    """Run KNN inference and return prediction + key factors."""
    model        = app_state.get("model")
    scaler       = app_state.get("scaler")
    feature_cols = app_state.get("feature_cols")

    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded. Run ml_pipeline.py first.")

    # Encode & scale
    encoded   = encode_input(req)
    row       = np.array([[encoded[c] for c in feature_cols]])
    row_sc    = scaler.transform(row)

    # Predict
    label     = int(model.predict(row_sc)[0])
    # Confidence = proportion of k neighbours voting for prediction
    neighbors = model.kneighbors(row_sc, return_distance=False)[0]
    neighbor_labels = [int(model._y[i]) for i in neighbors]
    approval_votes  = sum(neighbor_labels)
    confidence      = round(approval_votes / len(neighbor_labels), 4)

    status = "Approved" if label == 1 else "Rejected"

    key_factors = build_key_factors(req, label)
    emi         = estimate_emi(req.LoanAmount, req.Loan_Amount_Term)

    return PredictionResponse(
        status=status,
        prediction=status,
        confidence_score=confidence,
        confidence=confidence,
        key_factors=key_factors,
        factors=key_factors,
        emi_estimate=emi,
        estimatedEMI=emi
    )


@app.get("/api/metrics", response_model=MetricsResponse, tags=["Metrics"])
def get_metrics():
    """Return model evaluation metrics."""
    m = app_state.get("metrics")
    if not m:
        raise HTTPException(status_code=503, detail="Metrics not available. Run ml_pipeline.py first.")

    return MetricsResponse(
        accuracy=m["accuracy"],
        precision=m["precision"],
        recall=m["recall"],
        f1_score=m["f1_score"],
        optimal_k=m["optimal_k"],
        best_metric=m["best_metric"],
        confusion_matrix=ConfusionMatrix(**m["confusion_matrix"]),
        training_size=m["training_size"],
        test_size=m["test_size"],
        feature_count=m["feature_count"],
        cv_results=m["cv_results"]
    )
