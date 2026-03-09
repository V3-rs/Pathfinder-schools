"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    onComplete: () => void;
}

const steps = [
    {
        title: "Welcome to Pathfinder",
        subtitle: "Your career journey starts here",
        description: "Discover careers that match your unique strengths, interests, and aspirations. Pathfinder uses AI to connect you with the right opportunities.",
        icon: "🧭",
        accent: "var(--accent-violet)",
    },
    {
        title: "How It Works",
        subtitle: "Three steps to your future",
        description: "Answer a few questions about your experience and goals. Explore career paths matched to you. Verify your skills and apply to real internships.",
        icon: "✨",
        accent: "var(--accent-gold)",
        features: [
            { emoji: "📝", title: "Pathfinder Quiz", desc: "5 questions about your experience and dreams" },
            { emoji: "🗺️", title: "Career Explorer", desc: "Interactive map of careers matched to you" },
            { emoji: "🎯", title: "Skill Verification", desc: "Prove your skills with quick demo tasks" },
        ],
    },
    {
        title: "Ready to Begin?",
        subtitle: "Let's discover your path",
        description: "Your answers help us find the best career matches. Be honest and detailed — there are no wrong answers, only your unique story.",
        icon: "🚀",
        accent: "var(--accent-emerald)",
    },
];

export default function OnboardingFlow({ onComplete }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const step = steps[currentStep];

    function handleNext() {
        if (currentStep < steps.length - 1) {
            setCurrentStep((s) => s + 1);
        } else {
            if (typeof window !== "undefined") {
                localStorage.setItem("pathfinder_onboarding_complete", "true");
            }
            onComplete();
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
            <div className="w-full max-w-lg">
                {/* Progress dots */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    {steps.map((_, i) => (
                        <motion.div
                            key={i}
                            className="rounded-full transition-all"
                            style={{
                                width: i === currentStep ? 32 : 8,
                                height: 8,
                                background: i === currentStep
                                    ? step.accent
                                    : i < currentStep
                                        ? "rgba(139, 92, 246, 0.5)"
                                        : "rgba(255, 255, 255, 0.1)",
                            }}
                            layout
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.97 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center"
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                            className="text-6xl mb-6 inline-block"
                            style={{ filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))" }}
                        >
                            {step.icon}
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="text-4xl font-bold mb-2 gradient-text"
                        >
                            {step.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg mb-6"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {step.subtitle}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                            className="text-base leading-relaxed mb-8 max-w-md mx-auto"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {step.description}
                        </motion.p>

                        {/* Features (step 2) */}
                        {step.features && (
                            <div className="grid gap-3 mb-8">
                                {step.features.map((f, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        className="glass-card flex items-center gap-4 p-4 text-left"
                                        style={{ borderRadius: "16px" }}
                                    >
                                        <span className="text-2xl">{f.emoji}</span>
                                        <div>
                                            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{f.title}</p>
                                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-center gap-4">
                            {currentStep > 0 && (
                                <button
                                    onClick={() => setCurrentStep((s) => s - 1)}
                                    className="btn-ghost"
                                >
                                    ← Back
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="btn-primary text-base px-8 py-3"
                            >
                                {currentStep < steps.length - 1 ? "Next →" : "Start Pathfinder →"}
                            </button>
                        </div>

                        {/* Skip */}
                        {currentStep < steps.length - 1 && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                onClick={() => {
                                    if (typeof window !== "undefined") {
                                        localStorage.setItem("pathfinder_onboarding_complete", "true");
                                    }
                                    onComplete();
                                }}
                                className="mt-6 text-sm transition-colors"
                                style={{ color: "var(--text-muted)" }}
                            >
                                Skip onboarding
                            </motion.button>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
