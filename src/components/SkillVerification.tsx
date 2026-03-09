"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTasksForSector, markSectorVerified, getVerifiedSectors, type SkillTask } from "@/lib/skill-tasks";

interface Props {
    sector: string;
    onClose: () => void;
    onVerified: () => void;
}

export default function SkillVerification({ sector, onClose, onVerified }: Props) {
    const tasks = getTasksForSector(sector);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    const task = tasks[currentTaskIndex];
    const isCorrect = selectedAnswer === task?.correctAnswer;

    function handleSubmit() {
        if (selectedAnswer === null) return;
        setShowResult(true);
        if (isCorrect) {
            setScore((s) => s + 1);
        }
    }

    function handleNext() {
        if (currentTaskIndex < tasks.length - 1) {
            setCurrentTaskIndex((i) => i + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            // All tasks done
            const passed = score + (isCorrect ? 1 : 0) >= Math.ceil(tasks.length * 0.5);
            if (passed) {
                markSectorVerified(sector);
                setCompleted(true);
                setTimeout(() => {
                    onVerified();
                    onClose();
                }, 2000);
            } else {
                setCompleted(true);
            }
        }
    }

    if (tasks.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(12px)" }}
                onClick={onClose}
            >
                <div className="glass-strong p-8 rounded-2xl max-w-md text-center" onClick={(e) => e.stopPropagation()}>
                    <p className="text-lg mb-4" style={{ color: "var(--text-primary)" }}>No verification tasks available for this sector yet.</p>
                    <button onClick={onClose} className="btn-primary">Close</button>
                </div>
            </motion.div>
        );
    }

    const totalCorrect = score + (showResult && isCorrect ? 1 : 0);
    const passed = totalCorrect >= Math.ceil(tasks.length * 0.5);

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
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="w-full max-w-lg rounded-2xl overflow-hidden"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--glass-border)", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 pb-4" style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="badge badge-violet">🎯 Skill Check</span>
                            <span className="badge badge-gold">{sector}</span>
                        </div>
                        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {/* Progress */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: "linear-gradient(90deg, var(--accent-violet), var(--accent-gold))" }}
                                animate={{ width: `${((currentTaskIndex + (showResult ? 1 : 0)) / tasks.length) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {currentTaskIndex + 1}/{tasks.length}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {completed ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            {passed ? (
                                <>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className="text-6xl mb-4"
                                    >
                                        ✅
                                    </motion.div>
                                    <h3 className="text-xl font-bold mb-2 gradient-text">Skills Verified!</h3>
                                    <p style={{ color: "var(--text-secondary)" }}>
                                        You scored {totalCorrect}/{tasks.length}. You can now apply to {sector} internships.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="text-6xl mb-4">📚</div>
                                    <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Keep Learning!</h3>
                                    <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                                        You scored {totalCorrect}/{tasks.length}. You need at least {Math.ceil(tasks.length * 0.5)} correct answers to pass.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setCurrentTaskIndex(0);
                                            setSelectedAnswer(null);
                                            setShowResult(false);
                                            setScore(0);
                                            setCompleted(false);
                                        }}
                                        className="btn-primary"
                                    >
                                        Try Again
                                    </button>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTaskIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-lg font-semibold mb-5" style={{ color: "var(--text-primary)" }}>
                                    {task.question}
                                </h3>

                                <div className="space-y-3 mb-6">
                                    {task.options.map((option, i) => (
                                        <button
                                            key={i}
                                            onClick={() => !showResult && setSelectedAnswer(i)}
                                            disabled={showResult}
                                            className="w-full text-left p-4 rounded-xl transition-all text-sm"
                                            style={{
                                                background: showResult
                                                    ? i === task.correctAnswer
                                                        ? "var(--accent-emerald-dim)"
                                                        : i === selectedAnswer
                                                            ? "var(--accent-rose-dim)"
                                                            : "var(--bg-card)"
                                                    : selectedAnswer === i
                                                        ? "var(--accent-violet-dim)"
                                                        : "var(--bg-card)",
                                                border: `1.5px solid ${showResult
                                                        ? i === task.correctAnswer
                                                            ? "rgba(52, 211, 153, 0.3)"
                                                            : i === selectedAnswer
                                                                ? "rgba(244, 114, 182, 0.3)"
                                                                : "var(--glass-border)"
                                                        : selectedAnswer === i
                                                            ? "rgba(139, 92, 246, 0.4)"
                                                            : "var(--glass-border)"
                                                    }`,
                                                color: "var(--text-primary)",
                                                cursor: showResult ? "default" : "pointer",
                                            }}
                                        >
                                            <span className="inline-flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                                    style={{
                                                        background: selectedAnswer === i ? "var(--accent-violet)" : "rgba(255,255,255,0.06)",
                                                        color: selectedAnswer === i ? "white" : "var(--text-muted)",
                                                    }}
                                                >
                                                    {String.fromCharCode(65 + i)}
                                                </span>
                                                {option}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Explanation */}
                                {showResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl mb-4"
                                        style={{
                                            background: isCorrect ? "var(--accent-emerald-dim)" : "var(--accent-gold-dim)",
                                            border: `1px solid ${isCorrect ? "rgba(52, 211, 153, 0.2)" : "rgba(245, 183, 49, 0.2)"}`,
                                        }}
                                    >
                                        <p className="text-sm font-semibold mb-1" style={{ color: isCorrect ? "var(--accent-emerald)" : "var(--accent-gold)" }}>
                                            {isCorrect ? "✓ Correct!" : "✗ Not quite"}
                                        </p>
                                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                            {task.explanation}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Actions */}
                                <div className="flex justify-end gap-3">
                                    {!showResult ? (
                                        <button
                                            onClick={handleSubmit}
                                            disabled={selectedAnswer === null}
                                            className="btn-primary"
                                        >
                                            Submit Answer
                                        </button>
                                    ) : (
                                        <button onClick={handleNext} className="btn-primary">
                                            {currentTaskIndex < tasks.length - 1 ? "Next Question →" : "See Results"}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
