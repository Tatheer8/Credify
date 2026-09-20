"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Sun, Moon, LogOut, ChevronDown, ShieldCheck, Loader2 } from "lucide-react";
import { getSession, signOut, type User } from "@/lib/auth";

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onLogout?: () => void;
}

export default function Header({ darkMode, onToggleTheme, onLogout }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = getSession();
    if (s) {
      setUser(s.user);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Comprehensive Sign-Out Handler
   * 1. Calls backend /api/logout endpoint (if applicable) to invalidate server session
   * 2. Clears stored session tokens from localStorage and sessionStorage
   * 3. Resets component authentication state (user = null)
   * 4. Redirects user to /login
   */
  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      // 1. Invalidate server session if backend is active
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      await fetch(`${apiBase}/api/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).catch(() => {
        // Backend offline or unreachable: continue with client logout
      });
    } catch (_err) {
      // Ignore network errors on logout
    }

    // 2. Clear client auth tokens and sessions
    signOut();

    // 3. Reset local auth state
    setUser(null);
    setMenuOpen(false);

    // 4. Trigger callback if provided
    if (onLogout) {
      onLogout();
    }

    // 5. Redirect back to login page
    router.push("/login");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return (
    <header
      className="sticky top-0 z-50 border-b transition-colors duration-200"
      style={{
        background: darkMode ? "rgba(5, 9, 14, 0.85)" : "rgba(244, 251, 248, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: CrediWise AI Logo & Brand */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-emerald-900/40 transition-transform duration-200 group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #059669, #0d9488)" }}
          >
            <TrendingUp className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-lg sm:text-xl font-bold tracking-tight gradient-text"
              style={{ fontFamily: "var(--font-space), sans-serif" }}
            >
              CrediWise AI
            </span>
            <span className="text-[10px] tracking-wider uppercase hidden sm:block -mt-1 font-medium" style={{ color: "var(--text-muted)" }}>
              Intelligent Underwriting
            </span>
          </div>
        </Link>

        {/* Right: Theme toggle, Fatima Avatar "F", User name "Fatima", Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme toggle */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:border-emerald-500/40 hover:scale-105"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-default)",
            }}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-600 transition-transform" />
            )}
          </button>

          {/* User Profile dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              id="user-profile-btn"
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer hover:border-emerald-500/40"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
              }}
              aria-label="User profile menu"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-emerald-900/40"
                style={{ background: "linear-gradient(135deg, #059669, #0d9488)" }}
              >
                {user?.avatar || "F"}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {user?.name || "Fatima"}
                </span>
                <span className="text-[10px] hidden md:block leading-none" style={{ color: "var(--text-muted)" }}>
                  Senior Underwriter
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-60" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-60 p-2 rounded-2xl shadow-2xl z-50 glass"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-strong)",
                  }}
                >
                  <div className="px-3 py-2.5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-400">
                        Authenticated
                      </span>
                    </div>
                    <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>
                      {user?.name || "Fatima"}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {user?.email || "fatima.zahra@crediwise.ai"}
                    </p>
                  </div>
                  <div className="p-1.5">
                    {/* Active Sign Out Button in Dropdown */}
                    <button
                      id="dropdown-signout-btn"
                      type="button"
                      disabled={loggingOut}
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {loggingOut ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <LogOut className="w-3.5 h-3.5" />
                      )}
                      <span>{loggingOut ? "Signing Out…" : "Sign Out"}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Direct Navbar Logout Button */}
          <button
            id="navbar-logout-btn"
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-red-500/15 hover:border-red-500/40 hover:text-red-400 group disabled:opacity-50"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
            }}
            title="Sign out of CrediWise AI"
            aria-label="Sign Out"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 text-red-400 transition-transform group-hover:-translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
