"use client";
import { ShieldCheck, MapPin, CheckCircle2, AlertOctagon } from "lucide-react";
import ApplicationSummary from "./ApplicationSummary";
import type { LoanFormData } from "@/lib/types";

interface PropertyFormProps {
  data: LoanFormData;
  onChange: <K extends keyof LoanFormData>(key: K, value: LoanFormData[K]) => void;
  errors: Partial<Record<keyof LoanFormData, string>>;
}

export default function PropertyForm({ data, onChange, errors }: PropertyFormProps) {
  return (
    <div className="space-y-5">
      <div className="border-b pb-3" style={{ borderColor: "var(--border-subtle)" }}>
        <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          Credit History & Property Collateral
        </h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Historical debt servicing track record and collateral location classification
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Credit History */}
        <div className="space-y-1.5">
          <label htmlFor="creditHistory" className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Credit History
          </label>
          <select
            id="creditHistory"
            value={data.creditHistory}
            onChange={(e) => onChange("creditHistory", e.target.value as LoanFormData["creditHistory"])}
            className="input-base"
          >
            <option value="Good">Good — Meets guidelines (Clean repayment history)</option>
            <option value="Poor">Poor — Does not meet guidelines (Past delinquency / defaults)</option>
          </select>
          <p className="text-[11px]" style={{ color: data.creditHistory === "Good" ? "var(--success-400)" : "var(--danger-400)" }}>
            {data.creditHistory === "Good"
              ? "✓ Demonstrates high credit reliability (primary KNN approval signal)."
              : "⚠ Significantly increases default risk probability in KNN inference."}
          </p>
        </div>

        {/* Property Area */}
        <div className="space-y-1.5">
          <label htmlFor="propertyArea" className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            Property Area
          </label>
          <select
            id="propertyArea"
            value={data.propertyArea}
            onChange={(e) => onChange("propertyArea", e.target.value as LoanFormData["propertyArea"])}
            className="input-base"
          >
            <option value="Urban">Urban (Metropolitan core, high density & liquidity)</option>
            <option value="Semiurban">Semiurban (Suburban expansion zone, highest approval rate)</option>
            <option value="Rural">Rural (Developing region, subject to valuation buffers)</option>
          </select>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Regional zone influences asset collateral valuation and liquidation risk.
          </p>
        </div>
      </div>

      {/* Embedded Application Summary Card */}
      <div className="pt-2">
        <ApplicationSummary data={data} />
      </div>
    </div>
  );
}
