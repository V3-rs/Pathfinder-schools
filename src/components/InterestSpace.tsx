"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CAREER_PATHS, DEFAULT_EXPLORE_IDS, getFallbackPositions, getPositionsByDomain, type CareerNode } from "@/lib/careers";
import CareerDetailPanel from "./CareerDetailPanel";

const EMOJIS = [
  { id: "growth", emoji: "🌱", label: "Growth", dim: "growth" as const },
  { id: "strength", emoji: "💪", label: "Strength", dim: "strength" as const },
  { id: "passion", emoji: "💖", label: "Passion", dim: "passion" as const },
];

interface Props {
  initialMatchedIds?: string[];
  onStartOver?: () => void;
}

export default function InterestSpace({ initialMatchedIds = [], onStartOver }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showExplain, setShowExplain] = useState(false);

  const [activeEmoji, setActiveEmoji] = useState<"growth" | "strength" | "passion" | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(
    () => new Set(initialMatchedIds)
  );
  const [positions, setPositions] = useState<{ x: number; y: number }[]>(() =>
    getFallbackPositions(CAREER_PATHS.length)
  );
  const [selectedCareer, setSelectedCareer] = useState<CareerNode | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/career-positions")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.positions && data.positions.length === CAREER_PATHS.length) {
          setPositions(data.positions);
        }
      })
      .catch(() => { });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayCareers = useMemo(() => {
    if (matchedIds.size > 0) {
      return CAREER_PATHS.filter((c) => matchedIds.has(c.id));
    }
    return CAREER_PATHS.filter((c) => DEFAULT_EXPLORE_IDS.includes(c.id));
  }, [matchedIds]);

  const displayPositions = useMemo(() => getPositionsByDomain(displayCareers), [displayCareers]);

  const positionMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    displayCareers.forEach((c, i) => {
      map.set(c.id, displayPositions[i] ?? { x: 50, y: 50 });
    });
    return map;
  }, [displayCareers, displayPositions]);

  const dimensionScores = useMemo(() => {
    if (!activeEmoji) return null;
    const map = new Map<string, number>();
    displayCareers.forEach((c) => map.set(c.id, c.dimensions[activeEmoji] ?? 0));
    return map;
  }, [activeEmoji, displayCareers]);

  async function handleSearch() {
    if (!inputText.trim()) return;
    setSearchLoading(true);
    setMatchedIds(new Set());
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream_text: inputText.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.matched_career_ids?.length) {
        setMatchedIds(new Set(data.matched_career_ids));
        setIsExpanded(false);
      } else if (res.ok) {
        setMatchedIds(new Set());
      }
    } catch (_) {
      setMatchedIds(new Set());
    } finally {
      setSearchLoading(false);
    }
  }

  function handleRefresh() {
    setInputText("");
    setIsExpanded(false);
    setMatchedIds(new Set());
    setActiveEmoji(null);
    setSelectedCareer(null);
    fetch("/api/career-positions")
      .then((r) => r.json())
      .then((data) => {
        if (data.positions?.length === CAREER_PATHS.length) setPositions(data.positions);
      })
      .catch(() => { });
  }

  function handleEmojiClick(dim: "growth" | "strength" | "passion") {
    setActiveEmoji((prev) => (prev === dim ? null : dim));
  }

  return (
    <main className="min-h-screen overflow-hidden relative" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="relative z-10 glass-strong" style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold gradient-text">Pathfinder</h1>
          <div className="flex items-center gap-2">
            <Link href="/topics" className="nav-link">AI Topics</Link>
            <Link href="/internships" className="nav-link">Internships</Link>
            <Link href="/cv-builder" className="nav-link">CV Builder</Link>
            <Link href="/employer/login" className="nav-link">Employer Portal</Link>
            {onStartOver && (
              <button onClick={onStartOver} className="nav-link" style={{ color: "var(--accent-gold)" }}>
                Start over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Career nodes */}
      <section className="relative h-[calc(100vh-180px)] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0" style={{ perspective: "1000px" }}>
          <AnimatePresence mode="popLayout">
            {displayCareers.map((career, i) => {
              const pos = positionMap.get(career.id) ?? { x: 50, y: 50 };
              const dimScore = dimensionScores?.get(career.id) ?? 1;
              const emojiEmphasis = activeEmoji ? 0.4 + dimScore * 0.7 : 1;

              return (
                <motion.button
                  key={career.id}
                  layout
                  initial={{ opacity: 0, scale: 0.1, y: -40 }}
                  animate={{
                    opacity: emojiEmphasis,
                    scale: 0.95 + dimScore * 0.15,
                    y: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    delay: i * 0.04,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  whileHover={{
                    scale: 1.2,
                    zIndex: 10,
                    transition: { duration: 0.15 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute cursor-pointer select-none text-left"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => setSelectedCareer(career)}
                >
                  <motion.div
                    className="flex items-center gap-2 group max-w-[140px] rounded-xl px-3 py-1.5 -m-3 transition-colors"
                    style={{ background: "transparent" }}
                    title={career.title}
                    animate={{
                      y: [0, -5, 0],
                      transition: {
                        duration: 2.5 + (i % 4) * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                    whileHover={{
                      background: "rgba(139, 92, 246, 0.1)",
                    }}
                  >
                    <motion.span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        background: career.source === "database"
                          ? "var(--accent-blue)"
                          : "var(--accent-emerald)",
                        boxShadow: career.source === "database"
                          ? "0 0 8px rgba(96, 165, 250, 0.5)"
                          : "0 0 8px rgba(52, 211, 153, 0.5)",
                      }}
                      animate={{
                        opacity: [1, 0.5, 1],
                        scale: [1, 1.3, 1],
                        transition: {
                          duration: 1.8,
                          repeat: Infinity,
                          delay: i * 0.12,
                          ease: "easeInOut",
                        },
                      }}
                    />
                    <span className="text-[11px] font-medium truncate transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {career.title}
                    </span>
                  </motion.div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Central hub */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-20"
        >
          <div
            className="relative w-52 h-52 rounded-full flex flex-col items-center justify-center cursor-pointer animate-pulse-glow"
            style={{
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(10, 10, 26, 0.95) 70%)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <p className="text-[var(--text-muted)] text-sm mb-2">Explore paths by...</p>
            <div className="flex gap-2 mb-3">
              {EMOJIS.map((e) => (
                <button
                  key={e.id}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleEmojiClick(e.dim);
                  }}
                  className="text-2xl p-1.5 rounded-xl transition-all"
                  style={{
                    background: activeEmoji === e.dim ? "var(--accent-violet-dim)" : "transparent",
                    boxShadow: activeEmoji === e.dim ? "0 0 12px rgba(139, 92, 246, 0.3)" : "none",
                    transform: activeEmoji === e.dim ? "scale(1.15)" : "scale(1)",
                  }}
                  title={`Filter by ${e.label}`}
                >
                  {e.emoji}
                </button>
              ))}
            </div>
            {activeEmoji && (
              <p className="text-xs font-medium" style={{ color: "var(--accent-violet)" }}>
                Showing {EMOJIS.find((e) => e.dim === activeEmoji)?.label}
              </p>
            )}
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              style={{ color: "var(--text-muted)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-72"
                >
                  <div
                    className="p-5 rounded-2xl glass-strong"
                    style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="e.g. software, robotics, data science..."
                      className="input-dark w-full text-sm"
                    />
                    <button
                      onClick={handleSearch}
                      disabled={searchLoading}
                      className="mt-4 w-full btn-primary text-sm"
                    >
                      {searchLoading ? "Finding paths..." : "Explore paths"}
                    </button>
                    <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
                      Tell us your interests to highlight matching careers
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 glass-strong px-6 py-4" style={{ borderTop: "1px solid var(--glass-border)" }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-blue)", boxShadow: "0 0 6px rgba(96, 165, 250, 0.5)" }} />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>Database result</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-emerald)", boxShadow: "0 0 6px rgba(52, 211, 153, 0.5)" }} />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>AI result</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowExplain(!showExplain)}
              className="text-sm font-medium transition-colors"
              style={{ color: "var(--accent-blue)" }}
            >
              Why am I seeing these results?
            </button>
            <button
              onClick={handleRefresh}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{
                background: "linear-gradient(135deg, var(--accent-violet), #a855f7)",
                boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
                color: "white"
              }}
              title="Refresh"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        {showExplain && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto mt-4 p-4 rounded-xl glass text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            <strong style={{ color: "var(--accent-blue)" }}>Database results</strong> come from curated campus opportunities.{" "}
            <strong style={{ color: "var(--accent-emerald)" }}>AI results</strong> are career paths matched to your interests. Click emoji filters
            to emphasize Growth 🌱, Strength 💪, or Passion 💖. Click a career to see details.
          </motion.div>
        )}
      </footer>

      <AnimatePresence>
        {selectedCareer && (
          <CareerDetailPanel career={selectedCareer} onClose={() => setSelectedCareer(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
