"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import IntakeQuestionnaire from "@/components/IntakeQuestionnaire";
import InterestSpace from "@/components/InterestSpace";
import OnboardingFlow from "@/components/OnboardingFlow";
import UserLoginModal from "@/components/UserLoginModal";

export default function Home() {
  const [phase, setPhase] = useState<"onboarding" | "questionnaire" | "login" | "explorer">("onboarding");
  const [initialMatchedIds, setInitialMatchedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const done = localStorage.getItem("pathfinder_onboarding_complete");
      if (done === "true") {
        setPhase("questionnaire");
      }
    }
  }, []);

  function handleQuestionnaireSubmit(answers: Record<string, string>) {
    setSubmitting(true);
    fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionnaire: answers }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.matched_career_ids?.length) {
          setInitialMatchedIds(data.matched_career_ids);
        }
        setPhase("login");
      })
      .catch(() => setPhase("login"))
      .finally(() => setSubmitting(false));
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "onboarding" ? (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen relative"
        >
          <OnboardingFlow onComplete={() => setPhase("questionnaire")} />
        </motion.div>
      ) : phase === "questionnaire" ? (
        <motion.div
          key="questionnaire"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen relative"
        >
          <header className="relative z-10 glass-strong" style={{ borderBottom: "1px solid var(--glass-border)" }}>
            <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
              <h1 className="text-lg font-bold gradient-text">Pathfinder</h1>
              <div className="flex items-center gap-2">
                <Link href="/topics" className="nav-link">AI Topics</Link>
                <Link href="/internships" className="nav-link">Internships</Link>
                <Link href="/resources" className="nav-link">Resources</Link>
                <Link href="/cv-builder" className="nav-link">CV Builder</Link>
                <Link href="/employer/login" className="nav-link">Employer Portal</Link>
                <button
                  onClick={() => setPhase("login")}
                  className="nav-link"
                  style={{ color: "var(--accent-gold)" }}
                >
                  Skip →
                </button>
              </div>
            </div>
          </header>
          <IntakeQuestionnaire onSubmit={handleQuestionnaireSubmit} submitting={submitting} />
        </motion.div>
      ) : phase === "login" ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen relative"
        >
          <UserLoginModal onContinue={() => setPhase("explorer")} />
        </motion.div>
      ) : (
        <motion.div
          key="explorer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <InterestSpace
            initialMatchedIds={initialMatchedIds}
            onStartOver={() => {
              setPhase("questionnaire");
              setInitialMatchedIds([]);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
