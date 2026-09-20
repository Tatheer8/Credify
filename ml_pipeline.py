# -*- coding: utf-8 -*-
"""
LoanLogic AI - ML Pipeline
==========================
Trains a KNN classifier on the Kaggle Loan Prediction dataset,
exports artifacts: model, scaler, and metrics JSON.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

import os
import json
import warnings
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report
)

warnings.filterwarnings("ignore")

# ─────────────────────────────────────────────────────────
# 0. Paths
# ─────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
DATA_PATH   = os.path.join(BASE_DIR, "dataset", "train_u6lujuX_CVtuZ9i.csv")
ARTIFACT_DIR = os.path.join(BASE_DIR, "artifacts")
os.makedirs(ARTIFACT_DIR, exist_ok=True)

MODEL_PATH   = os.path.join(ARTIFACT_DIR, "loan_knn_model.pkl")
SCALER_PATH  = os.path.join(ARTIFACT_DIR, "scaler.pkl")
META_PATH    = os.path.join(ARTIFACT_DIR, "model_metadata.json")
METRICS_PATH = os.path.join(ARTIFACT_DIR, "model_metrics.json")

# ─────────────────────────────────────────────────────────
# 1. Load data
# ─────────────────────────────────────────────────────────
print("=" * 60)
print("  LoanLogic AI — KNN Training Pipeline")
print("=" * 60)

df = pd.read_csv(DATA_PATH)
print(f"\n[1/5] Loaded dataset: {df.shape[0]} rows × {df.shape[1]} cols")
print(f"      Missing values:\n{df.isnull().sum()}")

# Drop Loan_ID (not a feature)
df.drop(columns=["Loan_ID"], inplace=True)

# ─────────────────────────────────────────────────────────
# 2. Imputation
# ─────────────────────────────────────────────────────────
# Numeric -> median
for col in ["LoanAmount", "Loan_Amount_Term", "Credit_History"]:
    df[col] = df[col].fillna(df[col].median())

# Categorical -> mode
for col in ["Gender", "Married", "Dependents", "Self_Employed"]:
    df[col] = df[col].fillna(df[col].mode()[0])

# Safety: drop any rows that still have NaN
df = df.dropna().reset_index(drop=True)

print(f"\n[2/5] Imputed - remaining nulls: {df.isnull().sum().sum()}, rows kept: {len(df)}")

# ─────────────────────────────────────────────────────────
# 3. Feature Engineering
# ─────────────────────────────────────────────────────────
df["Total_Income"]      = df["ApplicantIncome"] + df["CoapplicantIncome"]
df["EMI"]               = df["LoanAmount"] / df["Loan_Amount_Term"]
df["log_LoanAmount"]    = np.log1p(df["LoanAmount"])
df["log_Total_Income"]  = np.log1p(df["Total_Income"])
df["Debt_to_Income"]    = df["LoanAmount"] / (df["Total_Income"] + 1)

print("[3/5] Feature engineering complete — 5 new features added")

# ─────────────────────────────────────────────────────────
# 4. Encoding
# ─────────────────────────────────────────────────────────
# Encode target
df["Loan_Status"] = df["Loan_Status"].map({"Y": 1, "N": 0})

# Categorical columns to label-encode
cat_cols = ["Gender", "Married", "Dependents", "Education",
            "Self_Employed", "Property_Area"]

encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    encoders[col] = {cls: int(idx) for idx, cls in enumerate(le.classes_)}

# Persist encoding map for backend use
with open(META_PATH, "w") as f:
    json.dump({"encoders": encoders, "cat_cols": cat_cols}, f, indent=2)

print("[4/5] Encoding done; metadata saved ->", META_PATH)

# ─────────────────────────────────────────────────────────
# 5. Train / Test split & Scaling
# ─────────────────────────────────────────────────────────
FEATURE_COLS = [
    "Gender", "Married", "Dependents", "Education", "Self_Employed",
    "ApplicantIncome", "CoapplicantIncome", "LoanAmount",
    "Loan_Amount_Term", "Credit_History", "Property_Area",
    "Total_Income", "EMI", "log_LoanAmount", "log_Total_Income", "Debt_to_Income"
]

X = df[FEATURE_COLS]
y = df["Loan_Status"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train_sc = scaler.fit_transform(X_train)
X_test_sc  = scaler.transform(X_test)

joblib.dump(scaler, SCALER_PATH)
print(f"\n[5/5] Split -> train={len(X_train)}, test={len(X_test)} | scaler saved")

# ─────────────────────────────────────────────────────────
# 6. Hyperparameter Tuning
# ─────────────────────────────────────────────────────────
print("\n" + "─" * 60)
print("  Hyperparameter Grid Search")
print("─" * 60)

n_neighbors_range = [3, 5, 7, 9, 11, 15]
metrics_list      = ["euclidean", "manhattan"]

results = []
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

for k in n_neighbors_range:
    for metric in metrics_list:
        knn = KNeighborsClassifier(n_neighbors=k, metric=metric)
        cv_scores = cross_val_score(knn, X_train_sc, y_train, cv=cv, scoring="f1")
        results.append({
            "k": k,
            "metric": metric,
            "mean_f1": cv_scores.mean(),
            "std_f1": cv_scores.std()
        })
        print(f"  k={k:2d}, metric={metric:10s} -> CV F1={cv_scores.mean():.4f} +/- {cv_scores.std():.4f}")

# Pick best by CV F1
best = max(results, key=lambda r: r["mean_f1"])
print(f"  >> Best k={best['k']}, metric={best['metric']}, F1={best['mean_f1']:.4f}")

# ---------------------------------------------------------
# 7. Final Model Training & Evaluation
# ---------------------------------------------------------
best_knn = KNeighborsClassifier(n_neighbors=best["k"], metric=best["metric"])
best_knn.fit(X_train_sc, y_train)
y_pred = best_knn.predict(X_test_sc)

acc       = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall    = recall_score(y_test, y_pred)
f1        = f1_score(y_test, y_pred)
cm        = confusion_matrix(y_test, y_pred)

print("\n" + "─" * 60)
print("  Final Model Evaluation")
print("─" * 60)
print(f"  Accuracy  : {acc:.4f}")
print(f"  Precision : {precision:.4f}")
print(f"  Recall    : {recall:.4f}")
print(f"  F1 Score  : {f1:.4f}")
print(f"  Confusion Matrix:\n  {cm}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["Rejected", "Approved"]))

# ─────────────────────────────────────────────────────────
# 8. Save Artifacts
# ─────────────────────────────────────────────────────────
# Save model (bundle model + feature column list)
model_bundle = {
    "model": best_knn,
    "feature_cols": FEATURE_COLS
}
joblib.dump(model_bundle, MODEL_PATH)

# Save metrics for /api/metrics endpoint
metrics_payload = {
    "accuracy":          round(acc, 4),
    "precision":         round(precision, 4),
    "recall":            round(recall, 4),
    "f1_score":          round(f1, 4),
    "optimal_k":         best["k"],
    "best_metric":       best["metric"],
    "confusion_matrix": {
        "tn": int(cm[0][0]),
        "fp": int(cm[0][1]),
        "fn": int(cm[1][0]),
        "tp": int(cm[1][1])
    },
    "training_size":     len(X_train),
    "test_size":         len(X_test),
    "feature_count":     len(FEATURE_COLS),
    "cv_results":        results
}

with open(METRICS_PATH, "w") as f:
    json.dump(metrics_payload, f, indent=2)

print("\n" + "=" * 60)
print("  Artifacts saved:")
print(f"   [*] Model   -> {MODEL_PATH}")
print(f"   [*] Scaler  -> {SCALER_PATH}")
print(f"   [*] Metadata-> {META_PATH}")
print(f"   [*] Metrics -> {METRICS_PATH}")
print("=" * 60)
