"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ACCRA_INTERNSHIPS } from "@/lib/internships";
import { getVerifiedSectors } from "@/lib/skill-tasks";
import SkillVerification from "@/components/SkillVerification";

export default function InternshipsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [verifiedSectors, setVerifiedSectors] = useState<Set<string>>(new Set());
  const [verifyingSector, setVerifyingSector] = useState<string | null>(null);

  useEffect(() => {
    setVerifiedSectors(getVerifiedSectors());
  }, []);

  const sectors = ["all", ...Array.from(new Set(ACCRA_INTERNSHIPS.map((i) => i.sector)))];
  const filtered =
    filter === "all"
      ? ACCRA_INTERNSHIPS
      : ACCRA_INTERNSHIPS.filter((i) => i.sector === filter);

  function handleApply(id: string) {
    setApplied((prev) => new Set(prev).add(id));
    // Track application for employer analytics
    if (typeof window !== "undefined") {
      const apps = JSON.parse(localStorage.getItem("pathfinder_applications") || "[]");
      const internship = ACCRA_INTERNSHIPS.find((i) => i.id === id);
      if (internship) {
        apps.push({
          internshipId: id,
          sector: internship.sector,
          role: internship.role,
          company: internship.company,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem("pathfinder_applications", JSON.stringify(apps));
      }
    }
  }

  return (
    <main className="min-h-screen relative z-10">
      <header className="glass-strong" style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold gradient-text">Internships in Accra</h1>
          <div className="flex items-center gap-2">
            <Link href="/" className="nav-link">← Pathfinder</Link>
            <Link href="/resources" className="nav-link">Resources</Link>
            <Link href="/cv-builder" className="nav-link">CV Builder</Link>
            <Link href="/employer/login" className="nav-link">Employer Portal</Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6" style={{ color: "var(--text-secondary)" }}
        >
          Browse and apply to internship opportunities. Complete a skill verification to unlock applications.
        </motion.p>

        {/* Sector filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sectors.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setFilter(s)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: filter === s
                  ? "linear-gradient(135deg, var(--accent-violet), #a855f7)"
                  : "var(--bg-card)",
                border: `1px solid ${filter === s ? "rgba(139, 92, 246, 0.4)" : "var(--glass-border)"}`,
                color: filter === s ? "white" : "var(--text-secondary)",
                boxShadow: filter === s ? "0 4px 15px rgba(139, 92, 246, 0.3)" : "none",
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && verifiedSectors.has(s) && " ✓"}
            </motion.button>
          ))}
        </div>

        {/* Internship cards */}
        <div className="space-y-5">
          {filtered.map((internship, i) => {
            const isVerified = verifiedSectors.has(internship.sector);
            return (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="badge badge-gold">{internship.sector}</span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{internship.type}</span>
                      {isVerified && (
                        <span className="badge badge-emerald">✓ Verified</span>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                      {internship.role}
                    </h2>
                    <p className="font-medium" style={{ color: "var(--accent-gold)" }}>{internship.company}</p>
                    <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                      {internship.location} · {internship.duration}
                    </p>
                    <p className="mt-3" style={{ color: "var(--text-secondary)" }}>{internship.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {internship.requirements.map((r, j) => (
                        <span key={j} className="tag text-xs">{r}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {!isVerified ? (
                      <button
                        onClick={() => setVerifyingSector(internship.sector)}
                        className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                        style={{
                          background: "var(--accent-gold-dim)",
                          border: "1px solid rgba(245, 183, 49, 0.3)",
                          color: "var(--accent-gold)",
                        }}
                      >
                        🎯 Verify Skills
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(internship.id)}
                        disabled={applied.has(internship.id)}
                        className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                        style={{
                          background: applied.has(internship.id)
                            ? "var(--bg-card)"
                            : "linear-gradient(135deg, var(--accent-violet), #a855f7)",
                          color: applied.has(internship.id) ? "var(--text-muted)" : "white",
                          boxShadow: applied.has(internship.id) ? "none" : "0 4px 15px rgba(139, 92, 246, 0.3)",
                          cursor: applied.has(internship.id) ? "default" : "pointer",
                        }}
                      >
                        {applied.has(internship.id) ? "✓ Applied" : "Apply →"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Skill Verification Modal */}
      <AnimatePresence>
        {verifyingSector && (
          <SkillVerification
            sector={verifyingSector}
            onClose={() => setVerifyingSector(null)}
            onVerified={() => {
              setVerifiedSectors(getVerifiedSectors());
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
