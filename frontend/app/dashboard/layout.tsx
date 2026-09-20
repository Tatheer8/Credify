"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { isAuthenticated } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication: redirect to login if unauthenticated
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setAuthorized(true);

    // Check saved theme or default to dark fintech
    const saved = localStorage.getItem("crediwise_theme");
    if (saved === "light") {
      setDarkMode(false);
      document.documentElement.classList.add("light");
    } else {
      setDarkMode(true);
      document.documentElement.classList.remove("light");
    }
  }, [router]);

  function toggleTheme() {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove("light");
        localStorage.setItem("crediwise_theme", "dark");
      } else {
        document.documentElement.classList.add("light");
        localStorage.setItem("crediwise_theme", "light");
      }
      return next;
    });
  }

  function handleLogout() {
    router.replace("/login");
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Sticky Header Navigation */}
      <Header
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Enterprise Footer */}
      <footer
        className="mt-auto border-t py-6 transition-colors"
        style={{ borderColor: "var(--border-subtle)", background: "rgba(5, 9, 14, 0.4)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <p>© {new Date().getFullYear()} CrediWise AI Inc. All rights reserved. Enterprise Loan Risk Underwriting.</p>
          </div>
          <div className="flex items-center gap-4">
            <span>KNN Algorithm v2.4</span>
            <span>•</span>
            <span>FCRA &amp; ECOA Compliant Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
