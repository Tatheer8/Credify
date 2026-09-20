"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Sun, Moon, LogOut, ChevronDown, ShieldCheck, Loader2, Sparkles, UserCheck } from "lucide-react";
import { getSession, signOut, continueAsGuest, type User } from "@/lib/auth";

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
    function syncUser() {
      const s = getSession();
      setUser(s ? s.user : null);
    }
    syncUser();
    window.addEventListener("auth-change", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("auth-change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  function handleSwitchToGuest() {
    const res = continueAsGuest();
    setUser(res.user);
    setMenuOpen(false);
    router.push("/dashboard");
  }

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

        {/* Right: Guest Chip / Conversion, Theme toggle, User Avatar, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Guest Mode Status Chip & Conversion CTA */}
          {user?.isGuest && (
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(245, 158, 11, 0.12)",
                  color: "#fbbf24",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                }}
                title="You are browsing in temporary Guest Mode."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Guest Mode</span>
                <span className="sm:hidden">Guest</span>
              </div>

              <Link
                href="/signup"
                id="guest-convert-btn"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(13,148,136,0.22))",
                  border: "1px solid rgba(16,185,129,0.4)",
                  color: "var(--brand-400)",
                }}
                title="Save your loan calculations and unlock cloud session persistence"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Assessment / Sign Up</span>
              </Link>
            </div>
          )}

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
                style={{
                  background: user?.isGuest
                    ? "linear-gradient(135deg, #d97706, #b45309)"
                    : "linear-gradient(135deg, #059669, #0d9488)",
                }}
              >
                {user?.avatar || (user?.isGuest ? "G" : "F")}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {user?.name || (user?.isGuest ? "Guest User" : "Fatima")}
                </span>
                <span className="text-[10px] hidden md:block leading-none" style={{ color: "var(--text-muted)" }}>
                  {user?.role || (user?.isGuest ? "Guest Mode" : "Senior Underwriter")}
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
                  className="absolute right-0 mt-2 w-64 p-2 rounded-2xl shadow-2xl z-50 glass"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-strong)",
                  }}
                >
                  <div className="px-3 py-2.5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      {user?.isGuest ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                            Guest Session
                          </span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-400">
                            Authenticated
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>
                      {user?.name || "Guest User"}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {user?.email || "guest@crediwise.ai"}
                    </p>

                    {/* Conversion CTA inside dropdown for Guest */}
                    {user?.isGuest && (
                      <div className="mt-2.5 pt-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                        <Link
                          href="/signup"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Save Assessment / Sign Up</span>
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="p-1.5 space-y-1">
                    {/* Switch to Guest Mode option when signed in as registered/demo user */}
                    {!user?.isGuest && (
                      <button
                        id="dropdown-switch-guest-btn"
                        type="button"
                        onClick={handleSwitchToGuest}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Switch to Guest Mode</span>
                      </button>
                    )}

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
                      <span>{loggingOut ? "Signing Out…" : user?.isGuest ? "Exit Guest Mode" : "Sign Out"}</span>
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
