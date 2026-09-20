"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import type { ToastMessage } from "@/lib/types";

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const isSuccess = t.type === "success";
          const isError = t.type === "error";

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex items-center gap-3 p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs sm:text-sm font-medium"
              style={{
                background: isSuccess
                  ? "rgba(10, 24, 18, 0.95)"
                  : isError
                  ? "rgba(28, 12, 12, 0.95)"
                  : "rgba(14, 23, 34, 0.95)",
                borderColor: isSuccess
                  ? "rgba(16, 185, 129, 0.4)"
                  : isError
                  ? "rgba(239, 68, 68, 0.4)"
                  : "rgba(14, 165, 233, 0.4)",
                color: isSuccess ? "#6ee7b7" : isError ? "#fca5a5" : "#7dd3fc",
                boxShadow: isSuccess
                  ? "0 8px 30px rgba(16, 185, 129, 0.2)"
                  : isError
                  ? "0 8px 30px rgba(239, 68, 68, 0.2)"
                  : "0 8px 30px rgba(14, 165, 233, 0.2)",
              }}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isError ? (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              )}

              <p className="flex-1 leading-snug">{t.message}</p>

              <button
                type="button"
                onClick={() => onDismiss(t.id)}
                className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
