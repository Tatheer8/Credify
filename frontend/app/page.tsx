"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Zap } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-6"
      >
        <div className="flex items-center justify-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40"
            style={{ background: "linear-gradient(135deg, #059669, #0d9488)" }}
          >
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-space), sans-serif" }}>
            CrediWise AI
          </h1>
        </div>
        <div className="flex gap-4 justify-center text-sm" style={{ color: "var(--text-secondary)" }}>
          <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-400" /> Enterprise Secure</span>
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-teal-400" /> KNN ML Model</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Loading Loan Assessment Dashboard…
        </div>
      </motion.div>
    </div>
  );
}
