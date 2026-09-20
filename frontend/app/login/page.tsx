"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { signIn, continueAsGuest, isAuthenticated, isGuestUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated() && !isGuestUser()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    const res = signIn(email, password);
    setLoading(false);
    if (res.ok) {
      router.replace("/dashboard");
    } else {
      setError(res.error ?? "Login failed");
    }
  }

  function handleAutoFillDemo() {
    setEmail("demo@crediwise.ai");
    setPassword("demo123456");
    setError("");
  }

  function handleGuestMode() {
    continueAsGuest();
    router.push("/dashboard");
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
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
        {/* Logo & Branding */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg shadow-emerald-900/30"
            style={{ background: "linear-gradient(135deg, #059669, #0d9488)" }}
          >
            <TrendingUp className="w-8 h-8 text-white" />
          </motion.div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-space), sans-serif" }}
          >
            <span className="gradient-text">CrediWise AI</span>
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Intelligent Loan Assessment
          </p>
        </div>

        {/* Card */}
        <div className="glass p-8 space-y-5">
          {/* Return link at the top of the login container card */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Sign in to access your loan assessment dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email with comfortable left icon padding */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="text-xs font-semibold"
                style={{ color: "var(--text-secondary)" }}
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-base !pl-11"
                  style={{ paddingLeft: "2.75rem" }}
                />
              </div>
            </div>

            {/* Password with comfortable left icon padding */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-xs font-semibold"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base !pl-11 pr-10"
                  style={{ paddingLeft: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign In Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 cursor-pointer shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2 font-semibold">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>

            {/* Auto-fill Demo Credentials Button */}
            <button
              id="demo-autofill-btn"
              type="button"
              onClick={handleAutoFillDemo}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border hover:scale-[1.01]"
              style={{
                background: "rgba(16, 185, 129, 0.06)",
                borderColor: "rgba(16, 185, 129, 0.3)",
                color: "var(--brand-400)",
              }}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Auto-fill Demo Credentials</span>
            </button>
            <p
              className="text-center text-[11px] -mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              Instantly test with pre-configured sandbox credentials
            </p>

            {/* Subtle horizontal divider with "or" */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: "var(--border-subtle)" }} />
              </div>
              <div className="relative flex justify-center text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="px-2 font-medium" style={{ background: "var(--bg-card)" }}>
                  or
                </span>
              </div>
            </div>

            {/* Continue as Guest Button */}
            <button
              id="guest-login-btn"
              type="button"
              onClick={handleGuestMode}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.03] text-slate-300 hover:text-white"
              style={{ background: "var(--bg-elevated)" }}
            >
              <UserCheck className="w-4 h-4 text-teal-400" />
              <span>Continue as Guest</span>
            </button>
            <p className="text-center text-[11px] -mt-1" style={{ color: "var(--text-muted)" }}>
              Explore the loan assessment dashboard instantly without logging in
            </p>
          </form>

          {/* Divider */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: "var(--border-subtle)" }} />
            </div>
            <div className="relative flex justify-center text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="px-2" style={{ background: "var(--bg-card)" }}>
                Don&apos;t have an account?
              </span>
            </div>
          </div>

          {/* Create Account Link */}
          <Link
            href="/signup"
            id="goto-signup"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
            }}
          >
            Create an account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
