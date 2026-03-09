"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTIONNAIRE, SECTION_LABELS } from "@/lib/questionnaire";

const NO_EXPERIENCE_TEXT = "No experience yet — I'm just starting out and eager to learn!";

interface Props {
  onSubmit: (answers: Record<string, string>) => void;
  submitting?: boolean;
}

export default function IntakeQuestionnaire({ onSubmit, submitting = false }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const sections = ["experience", "aspiration"];
  const currentSection = sections[step];
  const sectionQuestions = QUESTIONNAIRE.filter((q) => q.section === currentSection);
  const progress = submitting ? 100 : step === 0 ? 30 : 70;

  function handleAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleNoExperience(id: string) {
    setAnswers((prev) => ({ ...prev, [id]: NO_EXPERIENCE_TEXT }));
  }

  function handleNext() {
    if (step < sections.length - 1) {
      setStep((s) => s + 1);
    } else {
      onSubmit(answers);
    }
  }

  const minChars = 15;
  const canProceed = sectionQuestions.every((q) => {
    const val = answers[q.id]?.trim();
    if (!val) return false;
    // Optional questions with the "no experience" text are always valid
    if (q.optional && val === NO_EXPERIENCE_TEXT) return true;
    return val.length >= minChars;
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold mb-3 gradient-text"
          >
            Pathfinder
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--text-secondary)] text-lg"
          >
            Five questions to surface the careers that fit you.
          </motion.p>

          {/* Progress bar */}
          <div className="mt-6 h-2 rounded-full overflow-hidden bg-[rgba(255,255,255,0.06)]">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, var(--accent-violet), var(--accent-gold))",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Step {step + 1} of {sections.length}
          </p>
        </div>

        {/* Section content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg, var(--accent-violet-dim), var(--accent-gold-dim))",
                  color: "var(--accent-gold)",
                  border: "1px solid rgba(139, 92, 246, 0.2)"
                }}
              >
                {step + 1}
              </span>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {SECTION_LABELS[currentSection]}
              </h2>
            </div>

            <div className="space-y-6">
              {sectionQuestions.map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor={q.id}
                      className="block text-sm font-medium text-[var(--text-secondary)]"
                    >
                      {q.label}
                    </label>
                    {q.optional && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{
                        background: "var(--accent-gold-dim)",
                        color: "var(--accent-gold)",
                        border: "1px solid rgba(245, 183, 49, 0.2)"
                      }}>
                        Optional
                      </span>
                    )}
                  </div>
                  <textarea
                    id={q.id}
                    value={answers[q.id] ?? ""}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    rows={4}
                    className="input-dark w-full resize-none"
                  />
                  {/* "No experience yet" quick-fill button */}
                  {q.optional && answers[q.id] !== NO_EXPERIENCE_TEXT && (
                    <button
                      type="button"
                      onClick={() => handleNoExperience(q.id)}
                      className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--text-muted)",
                      }}
                    >
                      🙋 No experience yet — that&apos;s okay!
                    </button>
                  )}
                  {answers[q.id] && answers[q.id] !== NO_EXPERIENCE_TEXT && answers[q.id].length < minChars && (
                    <p className="text-xs mt-1.5" style={{ color: "var(--accent-gold)" }}>
                      Add a bit more detail (at least {minChars} characters)
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-10 flex justify-between items-center">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed || submitting}
                className="btn-primary flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Finding your paths...
                  </>
                ) : step < sections.length - 1 ? "Continue →" : "See my career paths →"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
