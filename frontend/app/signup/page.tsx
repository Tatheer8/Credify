"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Mail, Lock, Eye, EyeOff, User, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { signUp, isAuthenticated } from "@/lib/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/dashboard");
  }, [router]);

  const strength = (() => {
    let s = 0;
    if (password.length >= 8)    s++;
    if (/[A-Z]/.test(password))  s++;
    if (/[0-9]/.test(password))  s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#14b8a6", "#10b981"][strength];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const res = signUp(name, email, password);
    setLoading(false);
    if (res.ok) {
      router.replace("/dashboard");
    } else {
      setError(res.error ?? "Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg shadow-emerald-900/30"
            style={{ background: "linear-gradient(135deg, #059669, #0d9488)" }}
          >
            <TrendingUp className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-space), sans-serif" }}>
            <span className="gradient-text">CrediWise AI</span>
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Intelligent Loan Assessment
          </p>
        </div>

        <div className="glass p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Create your account
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Get started with AI-powered loan assessment
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                <input id="signup-name" type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="John Doe" className="input-base pl-10" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                <input id="signup-email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-base pl-10" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                <input id="signup-password" type={showPw ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" className="input-base pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded"
                  style={{ color: "var(--text-muted)" }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex gap-1 mt-1.5">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthColor : "var(--bg-elevated)" }} />
                    ))}
                  </div>
                  <p className="text-xs mt-1" style={{ color: strengthColor }}>{strengthLabel}</p>
                </motion.div>
              )}
            </div>

            {/* Confirm */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                <input id="signup-confirm" type={showPw ? "text" : "password"} required value={confirm}
                  onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" className="input-base pl-10 pr-10" />
                {confirm.length > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {confirm === password
                      ? <CheckCircle className="w-4 h-4" style={{ color: "var(--success-500)" }} />
                      : <AlertCircle className="w-4 h-4" style={{ color: "var(--danger-400)" }} />}
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg"
                  style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button id="signup-submit" type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>
              )}
            </button>
          </form>

          <div className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" id="goto-login" className="font-medium" style={{ color: "var(--brand-400)" }}>
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
