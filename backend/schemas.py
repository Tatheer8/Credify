"""
CrediWise AI — Pydantic Schemas
"""
from pydantic import BaseModel, Field, model_validator
from typing import Literal, Optional, List, Dict, Any


class LoanApplicationRequest(BaseModel):
    # Personal Details
    Gender:          Optional[Literal["Male", "Female"]]                    = Field("Male", description="Applicant gender")
    Married:         Optional[Literal["Yes", "No"]]                         = Field("No", description="Marital status")
    Dependents:      Optional[Literal["0", "1", "2", "3+"]]                 = Field("0", description="Number of dependents")
    Education:       Optional[Literal["Graduate", "Not Graduate"]]          = Field("Graduate", description="Education level")
    Self_Employed:   Optional[Literal["Yes", "No"]]                         = Field("No", description="Self-employment status")
    applicantName:   Optional[str]                                          = Field("Fatima Zahra", description="Applicant Name")
    age:             Optional[float]                                        = Field(32, description="Applicant age")

    # Financial Profile
    ApplicantIncome:    Optional[float] = Field(None, ge=0,   description="Monthly applicant income")
    CoapplicantIncome:  Optional[float] = Field(0.0, ge=0,    description="Monthly co-applicant income")
    LoanAmount:         Optional[float] = Field(None, ge=1,   description="Loan amount (thousands)")
    Loan_Amount_Term:   Optional[float] = Field(360, ge=12,   description="Loan term in months")

    # Normalized fields matching alternative prompt format
    income:             Optional[float] = Field(None, description="Alternative alias for ApplicantIncome")
    coApplicantIncome:  Optional[float] = Field(None, description="Alternative alias for CoapplicantIncome")
    loanAmount:         Optional[float] = Field(None, description="Alternative alias for LoanAmount")
    loanTerm:           Optional[float] = Field(None, description="Alternative alias for Loan_Amount_Term")
    creditHistory:      Optional[Any]   = Field(None, description="Alternative alias for Credit_History")
    propertyArea:       Optional[str]   = Field(None, description="Alternative alias for Property_Area")
    employment:         Optional[str]   = Field(None, description="Alternative alias for Self_Employed")
    maritalStatus:      Optional[str]   = Field(None, description="Alternative alias for Married")

    # Credit & Property
    Credit_History: Optional[int] = Field(1, description="1 = good credit history, 0 = bad")
    Property_Area:  Optional[Literal["Urban", "Semiurban", "Rural"]] = Field("Urban", description="Property area type")

    @model_validator(mode="before")
    @classmethod
    def reconcile_aliases(cls, values: dict):
        if not isinstance(values, dict):
            return values
        # Reconcile income
        if values.get("ApplicantIncome") is None and values.get("income") is not None:
            values["ApplicantIncome"] = float(values["income"])
        elif values.get("ApplicantIncome") is None:
            values["ApplicantIncome"] = 5000.0

        # Reconcile coApplicantIncome
        if values.get("CoapplicantIncome") is None and values.get("coApplicantIncome") is not None:
            values["CoapplicantIncome"] = float(values["coApplicantIncome"])

        # Reconcile loanAmount
        if values.get("LoanAmount") is None and values.get("loanAmount") is not None:
            values["LoanAmount"] = float(values["loanAmount"])
        elif values.get("LoanAmount") is None:
            values["LoanAmount"] = 120.0

        # Reconcile loanTerm
        if values.get("Loan_Amount_Term") is None and values.get("loanTerm") is not None:
            values["Loan_Amount_Term"] = float(values["loanTerm"])
        elif values.get("Loan_Amount_Term") is None:
            values["Loan_Amount_Term"] = 360.0

        # Reconcile creditHistory
        if values.get("Credit_History") is None and values.get("creditHistory") is not None:
            val = values["creditHistory"]
            values["Credit_History"] = 1 if val in (1, "1", "Good", True) else 0

        # Reconcile propertyArea
        if values.get("Property_Area") is None and values.get("propertyArea") is not None:
            values["Property_Area"] = values["propertyArea"]

        # Reconcile employment
        if values.get("employment") is not None:
            values["Self_Employed"] = "Yes" if values["employment"] in ("Self-employed", "Yes") else "No"

        # Reconcile marital status
        if values.get("maritalStatus") is not None:
            values["Married"] = "Yes" if values["maritalStatus"] in ("Married", "Yes") else "No"

        return values


class KeyFactor(BaseModel):
    factor:   str
    impact:   Literal["positive", "negative", "neutral"]
    detail:   str


class ConfusionMatrix(BaseModel):
    tn: int
    fp: int
    fn: int
    tp: int


class PredictionResponse(BaseModel):
    status:           Literal["Approved", "Rejected"]
    prediction:       Optional[Literal["Approved", "Rejected"]] = None
    confidence_score: float = Field(..., description="Approval confidence 0.0–1.0")
    confidence:       Optional[float] = None
    key_factors:      List[KeyFactor]
    factors:          Optional[List[KeyFactor]] = None
    emi_estimate:     float = Field(..., description="Estimated monthly EMI (approx)")
    estimatedEMI:     Optional[float] = None


class MetricsResponse(BaseModel):
    accuracy:         float
    precision:        float
    recall:           float
    f1_score:         float
    optimal_k:        int
    best_metric:      str
    confusion_matrix: ConfusionMatrix
    training_size:    int
    test_size:        int
    feature_count:    int
    cv_results:       List[Dict[str, Any]]
