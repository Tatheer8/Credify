"use client";
import { User, Calendar, GraduationCap, Briefcase, Users, Heart } from "lucide-react";
import type { LoanFormData } from "@/lib/types";

interface PersonalFormProps {
  data: LoanFormData;
  onChange: <K extends keyof LoanFormData>(key: K, value: LoanFormData[K]) => void;
  errors: Partial<Record<keyof LoanFormData, string>>;
}

export default function PersonalForm({ data, onChange, errors }: PersonalFormProps) {
  return (
    <div className="space-y-4">
      <div className="border-b pb-3" style={{ borderColor: "var(--border-subtle)" }}>
        <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          Personal Information
        </h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Basic borrower demographics and household structure
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Applicant Name */}
        <div className="space-y-1.5">
          <label htmlFor="applicantName" className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <User className="w-3.5 h-3.5 text-emerald-400" />
            Applicant Name
          </label>
          <input
            id="applicantName"
            type="text"
            value={data.applicantName}
            onChange={(e) => onChange("applicantName", e.target.value)}
            placeholder="e.g. Fatima Zahra"
            className="input-base"
          />
          {errors.applicantName && (
            <p className="text-[11px] text-red-400">{errors.applicantName}</p>
          )}
        </div>

        {/* Age */}
        <div className="space-y-1.5">
          <label htmlFor="age" className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            Age
          </label>
          <input
            id="age"
            type="number"
            min={18}
            max={99}
            value={data.age}
            onChange={(e) => onChange("age", e.target.value)}
            placeholder="e.g. 32"
            className="input-base"
          />
          {errors.age && (
            <p className="text-[11px] text-red-400">{errors.age}</p>
          )}
        </div>

        {/* Education */}
        <div className="space-y-1.5">
          <label htmlFor="education" className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            Education
          </label>
          <select
            id="education"
            value={data.education}
            onChange={(e) => onChange("education", e.target.value as LoanFormData["education"])}
            className="input-base"
          >
            <option value="Graduate">Graduate (University Degree)</option>
            <option value="Not Graduate">Not Graduate (Secondary / Vocational)</option>
          </select>
        </div>

        {/* Employment Status */}
        <div className="space-y-1.5">
          <label htmlFor="employment" className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <Briefcase className="w-3.5 h-3.5 text-teal-400" />
            Employment Status
          </label>
          <select
            id="employment"
            value={data.employment}
            onChange={(e) => onChange("employment", e.target.value as LoanFormData["employment"])}
            className="input-base"
          >
            <option value="Employed">Employed (Salaried Corporate / Public)</option>
            <option value="Self-employed">Self-Employed (Business / Freelance)</option>
          </select>
        </div>

        {/* Dependents */}
        <div className="space-y-1.5">
          <label htmlFor="dependents" className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            Dependents
          </label>
          <select
            id="dependents"
            value={data.dependents}
            onChange={(e) => onChange("dependents", e.target.value as LoanFormData["dependents"])}
            className="input-base"
          >
            <option value="0">None (0 dependents)</option>
            <option value="1">1 Dependent</option>
            <option value="2">2 Dependents</option>
            <option value="3+">3 or more Dependents</option>
          </select>
        </div>

        {/* Marital Status */}
        <div className="space-y-1.5">
          <label htmlFor="maritalStatus" className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <Heart className="w-3.5 h-3.5 text-teal-400" />
            Marital Status
          </label>
          <select
            id="maritalStatus"
            value={data.maritalStatus}
            onChange={(e) => onChange("maritalStatus", e.target.value as LoanFormData["maritalStatus"])}
            className="input-base"
          >
            <option value="Single">Single / Unmarried</option>
            <option value="Married">Married</option>
          </select>
        </div>
      </div>
    </div>
  );
}
