"use client";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
  delay?: number;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color = "#10b981",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass stat-card p-4 sm:p-5 flex items-center gap-4 transition-all duration-200 hover:border-emerald-500/40"
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Icon with glowing backdrop */}
      <div
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{
          background: `radial-gradient(circle, ${color}28 0%, ${color}10 100%)`,
          border: `1px solid ${color}35`,
          boxShadow: `0 0 15px ${color}22`,
        }}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
      </div>

      {/* Label and Value */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider truncate" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p
          className="text-lg sm:text-2xl font-bold tracking-tight truncate mt-0.5"
          style={{ fontFamily: "var(--font-space), sans-serif", color: "var(--text-primary)" }}
        >
          {value}
        </p>
        {subtext && (
          <p className="text-[11px] truncate mt-0.5" style={{ color: color }}>
            {subtext}
          </p>
        )}
      </div>
    </motion.div>
  );
}
