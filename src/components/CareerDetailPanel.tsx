"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { CareerNode } from "@/lib/careers";

interface Props {
  career: CareerNode;
  onClose: () => void;
}

export default function CareerDetailPanel({ career, onClose }: Props) {
  const [activeGrowthIndex, setActiveGrowthIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--glass-border)", boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          aria-label="Close"
        >
          <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Find jobs button */}
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(career.title + " jobs near me")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-14 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, var(--accent-blue), #3b82f6)",
            color: "white",
            boxShadow: "0 4px 15px rgba(96, 165, 250, 0.3)"
          }}
        >
          Find jobs
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        <div className="p-8">
          {/* Quick Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            {career.salaryRange && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl"
                style={{ background: "var(--accent-emerald-dim)", border: "1px solid rgba(52, 211, 153, 0.15)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--accent-emerald)" }}>Salary Range</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{career.salaryRange}</p>
              </motion.div>
            )}
            {career.education && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-4 rounded-xl"
                style={{ background: "var(--accent-blue-dim)", border: "1px solid rgba(96, 165, 250, 0.15)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--accent-blue)" }}>Education</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">{career.education}</p>
              </motion.div>
            )}
          </div>

          {/* Build CV Button */}
          <Link
            href={`/cv-builder?career=${career.id}`}
            className="mb-8 w-full inline-flex items-center justify-center gap-2 btn-gold text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Build CV for this Career
          </Link>

          {/* A day in the life */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--accent-violet-dim)", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
                <svg className="w-5 h-5" style={{ color: "var(--accent-violet)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">A day in the life</h2>
            </div>
            <p className="text-[var(--text-secondary)] mb-4">
              Here&apos;s what a day in the life of a(n){" "}
              <span className="font-semibold gradient-text">{career.title}</span> might look like.
            </p>
            <div className="space-y-3">
              {career.dayInLife.map((task, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-4 rounded-xl"
                  style={{
                    background: i < 2 ? "var(--accent-gold-dim)" : "var(--bg-card)",
                    border: `1px solid ${i < 2 ? "rgba(245, 183, 49, 0.15)" : "var(--glass-border)"}`,
                    color: "var(--text-primary)"
                  }}
                >
                  {task}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Polymath intersection */}
          {career.polymathMeta && (
            <div className="mb-10 p-5 rounded-2xl" style={{ background: "var(--accent-gold-dim)", border: "1px solid rgba(245, 183, 49, 0.15)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--accent-gold)" }}>
                Intersection role · {career.polymathMeta.intersection}
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Why it fits</p>
                  <ul className="list-disc list-inside text-[var(--text-secondary)] text-sm space-y-1">
                    {career.polymathMeta.whyFit.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Proof task (1–2 hours)</p>
                  <p className="text-[var(--text-secondary)] text-sm">{career.polymathMeta.proofTask}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-1">2-week experiment</p>
                  <p className="text-[var(--text-secondary)] text-sm">{career.polymathMeta.twoWeekExperiment}</p>
                </div>
              </div>
            </div>
          )}

          {/* Areas for growth */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--accent-emerald-dim)", border: "1px solid rgba(52, 211, 153, 0.15)" }}>
                <svg className="w-5 h-5" style={{ color: "var(--accent-emerald)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </span>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Areas for growth</h2>
            </div>
            <p className="text-[var(--text-secondary)] mb-4">
              Every career presents opportunities to learn and specialize. Here&apos;s what that could look like as a(n){" "}
              <span className="font-semibold gradient-text">{career.title}</span>.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {career.growthAreas.map((area, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGrowthIndex(i)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: activeGrowthIndex === i ? "var(--accent-violet-dim)" : "var(--bg-card)",
                    border: `1.5px solid ${activeGrowthIndex === i ? "rgba(139, 92, 246, 0.4)" : "var(--glass-border)"}`,
                    color: activeGrowthIndex === i ? "#c084fc" : "var(--text-secondary)",
                  }}
                >
                  {area.skill}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGrowthIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-5 rounded-xl"
                style={{ background: "var(--accent-violet-dim)", border: "1px solid rgba(139, 92, 246, 0.15)" }}
              >
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {career.growthAreas[activeGrowthIndex]?.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
