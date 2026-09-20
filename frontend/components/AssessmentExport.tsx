"use client";
import { useState } from "react";
import { Download, FileText, Loader2, Check } from "lucide-react";
import type { LoanFormData, PredictionResult } from "@/lib/types";
import { getSession } from "@/lib/auth";

interface AssessmentExportProps {
  data: LoanFormData;
  result: PredictionResult;
  onExportSuccess?: () => void;
}

export default function AssessmentExport({ data, result, onExportSuccess }: AssessmentExportProps) {
  const [exporting, setExporting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  async function handleDownloadPDF() {
    setExporting(true);
    try {
      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const session = getSession();
      const underwriterStr = session?.user?.isGuest
        ? "Guest User (Guest Underwriter — Sandbox Mode)"
        : session?.user
        ? `${session.user.name} (${session.user.role})`
        : "Fatima (Senior Risk Underwriter)";

      const isApproved = result.prediction === "Approved";
      const totalIncome = (Number(data.income) || 0) + (Number(data.coApplicantIncome) || 0);

      // Create a clean offscreen document container styled specifically for high-DPI PDF capture
      const reportDiv = document.createElement("div");
      reportDiv.style.cssText = `
        position: fixed; top: -9999px; left: -9999px; width: 780px; padding: 40px;
        background: #080f16; color: #f1f7f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        box-sizing: border-box; line-height: 1.5; border: 1px solid #1a2c3d;
      `;

      reportDiv.innerHTML = `
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #059669, #0d9488); display: flex; align-items: center; justify-content: center; font-size: 22px; color: white; font-weight: bold;">
              📈
            </div>
            <div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
                CrediWise AI
              </h1>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #10b981; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Intelligent Loan Underwriting Report
              </p>
            </div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #94a3b8;">
            <p style="margin: 0; font-weight: 600; color: #f1f7f5;">Report ID: CW-${Date.now().toString().slice(-6)}</p>
            <p style="margin: 3px 0 0 0;">Date: ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</p>
            <p style="margin: 3px 0 0 0;">Underwriter: ${underwriterStr}</p>
          </div>
        </div>

        <!-- Decision Banner -->
        <div style="background: ${isApproved ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'}; border: 1.5px solid ${isApproved ? '#10b981' : '#ef4444'}; border-radius: 14px; padding: 22px; text-align: center; margin-bottom: 26px;">
          <div style="display: inline-block; font-size: 32px; font-weight: 900; color: ${isApproved ? '#34d399' : '#f87171'}; margin-bottom: 4px;">
            ${isApproved ? '✓ APPROVED' : '✗ REJECTED'}
          </div>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #cbd5e1;">
            ${isApproved ? 'This application meets CrediWise automated underwriting eligibility criteria.' : 'This application does not meet the minimum algorithmic risk thresholds.'}
          </p>
          <div style="display: flex; justify-content: center; gap: 40px; margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px;">
            <div>
              <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">Approval Confidence</span>
              <p style="margin: 2px 0 0 0; font-size: 20px; font-weight: 800; color: ${isApproved ? '#34d399' : '#f87171'};">
                ${Math.round(result.confidence * 100)}%
              </p>
            </div>
            <div>
              <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">Estimated Monthly EMI</span>
              <p style="margin: 2px 0 0 0; font-size: 20px; font-weight: 800; color: #10b981;">
                $${result.estimatedEMI.toLocaleString()} / mo
              </p>
            </div>
            <div>
              <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">Amortization Term</span>
              <p style="margin: 2px 0 0 0; font-size: 20px; font-weight: 800; color: #f1f7f5;">
                ${data.loanTerm} Months
              </p>
            </div>
          </div>
        </div>

        <!-- 2-Column Tables -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <!-- Applicant & Demographic Details -->
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px;">
            <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #10b981; font-weight: 700;">
              Applicant Profile
            </h3>
            <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 6px 0; color: #94a3b8;">Applicant Name</td><td style="padding: 6px 0; text-align: right; font-weight: 600; color: #fff;">${data.applicantName || 'Fatima Zahra'}</td></tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 6px 0; color: #94a3b8;">Age</td><td style="padding: 6px 0; text-align: right; font-weight: 600; color: #fff;">${data.age || '32'} years</td></tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 6px 0; color: #94a3b8;">Education</td><td style="padding: 6px 0; text-align: right; font-weight: 600; color: #fff;">${data.education}</td></tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 6px 0; color: #94a3b8;">Employment Status</td><td style="padding: 6px 0; text-align: right; font-weight: 600; color: #fff;">${data.employment}</td></tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 6px 0; color: #94a3b8;">Dependents</td><td style="padding: 6px 0; text-align: right; font-weight: 600; color: #fff;">${data.dependents}</td></tr>
              <tr><td style="padding: 6px 0; color: #94a3b8;">Marital Status</td><td style="padding: 6px 0; text-align: right; font-weight: 600; color: #fff;">${data.maritalStatus}</td></tr>
            </table>
          </div>

          <!-- Financial & Collateral Details -->
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px;">
            <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #14b8a6; font-weight: 700;">
              Financial & Collateral
            </h3>
            <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 6px 0; color: #94a3b8;">Primary Income</td><td style="padding: 6px 0; text-align: right; font-weight: 600; color: #fff;">$${Number(data.income).toLocaleString()}/mo</td></tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 6px 0; color: #94a3b8;">Co-applicant Income</td><td style="padding: 6px 0; text-align: right; font-weight: 600; color: #fff;">$${Number(data.coApplicantIncome).toLocaleString()}/mo</td></tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 6px 0; color: #94a3b8;">Requested Principal</td><td style="padding: 6px 0; text-align: right; font-weight: 600; color: #fff;">$${Number(data.loanAmount).toLocaleString()}K ($${(Number(data.loanAmount) * 1000).toLocaleString()})</td></tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 6px 0; color: #94a3b8;">Credit History</td><td style="padding: 6px 0; text-align: right; font-weight: 700; color: ${data.creditHistory === 'Good' ? '#34d399' : '#f87171'};">${data.creditHistory}</td></tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 6px 0; color: #94a3b8;">Property Area</td><td style="padding: 6px 0; text-align: right; font-weight: 600; color: #fff;">${data.propertyArea}</td></tr>
              <tr><td style="padding: 6px 0; color: #94a3b8;">Combined Income</td><td style="padding: 6px 0; text-align: right; font-weight: 700; color: #10b981;">$${totalIncome.toLocaleString()}/mo</td></tr>
            </table>
          </div>
        </div>

        <!-- Key Decision Factors -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700;">
            Key Algorithmic Decision Factors
          </h3>
          ${result.factors.map(f => `
            <div style="margin-bottom: 8px; padding: 10px 14px; border-radius: 8px; background: ${
              f.impact === 'positive' ? 'rgba(16,185,129,0.07)' : f.impact === 'negative' ? 'rgba(239,68,68,0.07)' : 'rgba(245,158,11,0.07)'
            }; border-left: 3px solid ${
              f.impact === 'positive' ? '#10b981' : f.impact === 'negative' ? '#ef4444' : '#f59e0b'
            };">
              <strong style="font-size: 12px; color: ${f.impact === 'positive' ? '#34d399' : f.impact === 'negative' ? '#f87171' : '#fbbf24'};">
                ${f.impact === 'positive' ? '✓' : f.impact === 'negative' ? '✗' : '•'} ${f.factor}
              </strong>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #94a3b8;">${f.detail}</p>
            </div>
          `).join("")}
        </div>

        <!-- Model Audit Metadata -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px; font-size: 10px; color: #64748b;">
          <div>
            <strong>Model:</strong> K-Nearest Neighbors Classifier (k=11, Euclidean) • <strong>Accuracy:</strong> 86.2% • <strong>Dataset:</strong> Kaggle Loan Benchmark
          </div>
          <div>
            CrediWise AI Engine v2.4 • Confidential Assessment Memo
          </div>
        </div>
      `;

      document.body.appendChild(reportDiv);

      const canvas = await html2canvas(reportDiv, {
        scale: 2,
        backgroundColor: "#080f16",
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);

      const safeName = (data.applicantName || "Applicant").replace(/[^a-z0-9]/gi, "_");
      pdf.save(`CrediWise_AI_Assessment_${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`);

      document.body.removeChild(reportDiv);
      setDownloaded(true);
      if (onExportSuccess) onExportSuccess();
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <button
      id="export-assessment-btn"
      type="button"
      onClick={handleDownloadPDF}
      disabled={exporting}
      className="btn-primary flex items-center gap-2 text-xs sm:text-sm px-4 py-2.5 shadow-lg cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
        boxShadow: "0 4px 18px rgba(16, 185, 129, 0.4)",
      }}
      title="Download comprehensive PDF loan assessment report"
    >
      {exporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Generating PDF…</span>
        </>
      ) : downloaded ? (
        <>
          <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <FileText className="w-4 h-4" />
          <span>Export Assessment</span>
        </>
      )}
    </button>
  );
}
