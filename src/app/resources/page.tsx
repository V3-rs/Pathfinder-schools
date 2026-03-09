"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Resource Data ─── */
interface Resource {
    id: string;
    name: string;
    url: string;
    description: string;
    emoji: string;
    gradient: string;
    tags: string[];
}

const RESOURCES: Resource[] = [
    {
        id: "forage",
        name: "The Forage",
        url: "https://www.theforage.com/simulations",
        description:
            "Complete free virtual job simulations from top companies. Build real-world skills and experience before you even graduate.",
        emoji: "🚀",
        gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        tags: ["Job Simulations", "Virtual Experience", "Free"],
    },
    {
        id: "coursera",
        name: "Coursera",
        url: "https://www.coursera.org",
        description:
            "Access thousands of courses from world-class universities like Stanford, Yale, and Google. Earn certificates to boost your CV.",
        emoji: "🎓",
        gradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
        tags: ["Online Courses", "Certificates", "Universities"],
    },
    {
        id: "grow-google",
        name: "Grow with Google",
        url: "https://grow.google",
        description:
            "Free career certificates, digital skills training, and tools from Google to help you find a job, grow your career, or start a business.",
        emoji: "🌱",
        gradient: "linear-gradient(135deg, #22c55e, #4ade80)",
        tags: ["Google Certificates", "Career Tools", "Free Training"],
    },
];

/* ─── Bacheca Data ─── */
interface BachecaEntry {
    id: string;
    title: string;
    description: string;
    link: string;
    type: "scholarship" | "program" | "exchange";
    deadline?: string;
    location?: string;
}

const BACHECA_ENTRIES: BachecaEntry[] = [
    {
        id: "erasmus-plus",
        title: "Erasmus+ Exchange Program",
        description:
            "EU-funded student exchange program offering study periods of 3-12 months at partner universities across Europe, with grants covering travel and living costs.",
        link: "https://erasmus-plus.ec.europa.eu",
        type: "exchange",
        deadline: "Varies by university",
        location: "Europe",
    },
    {
        id: "chevening",
        title: "Chevening Scholarships",
        description:
            "Fully funded UK government scholarships for outstanding emerging leaders. Covers tuition, living expenses, and flights for a one-year master's degree in the UK.",
        link: "https://www.chevening.org",
        type: "scholarship",
        deadline: "November 2026",
        location: "United Kingdom",
    },
    {
        id: "fulbright",
        title: "Fulbright Student Program",
        description:
            "Prestigious scholarships for graduate study, research, or English teaching assistantships abroad. Full funding including tuition, airfare, and living stipend.",
        link: "https://us.fulbrightonline.org",
        type: "scholarship",
        deadline: "October 2026",
        location: "Worldwide",
    },
    {
        id: "daad",
        title: "DAAD Scholarships — Study in Germany",
        description:
            "German Academic Exchange Service offering scholarships for international students to study at world-renowned German universities. Many programs are tuition-free.",
        link: "https://www.daad.de/en/",
        type: "program",
        deadline: "Varies by program",
        location: "Germany",
    },
];

const typeConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    scholarship: {
        label: "💰 Scholarship",
        color: "var(--accent-gold)",
        bg: "var(--accent-gold-dim)",
        border: "rgba(245, 183, 49, 0.25)",
    },
    program: {
        label: "📚 Program",
        color: "var(--accent-violet)",
        bg: "var(--accent-violet-dim)",
        border: "rgba(139, 92, 246, 0.25)",
    },
    exchange: {
        label: "🌍 Exchange",
        color: "var(--accent-emerald)",
        bg: "var(--accent-emerald-dim)",
        border: "rgba(52, 211, 153, 0.25)",
    },
};

/* ─── Animated Background Orbs ─── */
function FloatingOrb({ delay, size, x, y, color }: { delay: number; size: number; x: string; y: string; color: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: [0.15, 0.3, 0.15],
                scale: [1, 1.15, 1],
                y: [0, -20, 0],
            }}
            transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
            style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                background: color,
                filter: "blur(60px)",
                left: x,
                top: y,
                pointerEvents: "none",
            }}
        />
    );
}

/* ─── Component ─── */
export default function ResourcesPage() {
    const [activeFilter, setActiveFilter] = useState<"all" | "scholarship" | "program" | "exchange">("all");

    const filteredBacheca =
        activeFilter === "all" ? BACHECA_ENTRIES : BACHECA_ENTRIES.filter((e) => e.type === activeFilter);

    return (
        <main className="min-h-screen relative z-10">
            {/* Decorative floating orbs */}
            <FloatingOrb delay={0} size={300} x="5%" y="10%" color="rgba(139, 92, 246, 0.08)" />
            <FloatingOrb delay={2} size={250} x="75%" y="30%" color="rgba(245, 183, 49, 0.06)" />
            <FloatingOrb delay={4} size={200} x="40%" y="70%" color="rgba(52, 211, 153, 0.06)" />

            {/* Header */}
            <header className="glass-strong" style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold gradient-text">Student Resources</h1>
                    <div className="flex items-center gap-2">
                        <Link href="/" className="nav-link">← Pathfinder</Link>
                        <Link href="/internships" className="nav-link">Internships</Link>
                        <Link href="/cv-builder" className="nav-link">CV Builder</Link>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* ─── Section 1: Useful Tools ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="text-center mb-10">
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: "spring" }}
                            className="text-5xl block mb-4"
                        >
                            🧰
                        </motion.span>
                        <h2 className="text-3xl font-bold gradient-text mb-3">Useful Tools & Platforms</h2>
                        <p className="max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                            Curated platforms to help you build skills, earn certificates, and get job-ready.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {RESOURCES.map((resource, i) => (
                            <motion.a
                                key={resource.id}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="glass-card p-6 block group cursor-pointer"
                                style={{ textDecoration: "none" }}
                            >
                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-transform group-hover:scale-110"
                                    style={{ background: resource.gradient, boxShadow: `0 8px 24px ${resource.gradient.includes("6366") ? "rgba(99, 102, 241, 0.3)" : resource.gradient.includes("0ea5") ? "rgba(14, 165, 233, 0.3)" : "rgba(34, 197, 94, 0.3)"}` }}
                                >
                                    {resource.emoji}
                                </div>

                                {/* Name + arrow */}
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                                        {resource.name}
                                    </h3>
                                    <motion.span
                                        className="text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        ↗
                                    </motion.span>
                                </div>

                                {/* Description */}
                                <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                    {resource.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {resource.tags.map((tag) => (
                                        <span key={tag} className="tag text-xs">{tag}</span>
                                    ))}
                                </div>

                                {/* Bottom glow on hover */}
                                <div
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ background: resource.gradient }}
                                />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* ─── Divider ─── */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="flex-1 h-px" style={{ background: "var(--glass-border)" }} />
                    <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="text-3xl"
                    >
                        📌
                    </motion.span>
                    <div className="flex-1 h-px" style={{ background: "var(--glass-border)" }} />
                </div>

                {/* ─── Section 2: Bacheca ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold gradient-text-violet mb-3">
                            Bacheca — Study Abroad & Scholarships
                        </h2>
                        <p className="max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                            Opportunities for students looking to study abroad, get funded, or join international programs.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {(["all", "scholarship", "program", "exchange"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                                style={{
                                    background: activeFilter === f
                                        ? "linear-gradient(135deg, var(--accent-violet), #a855f7)"
                                        : "var(--bg-card)",
                                    border: `1px solid ${activeFilter === f ? "rgba(139, 92, 246, 0.4)" : "var(--glass-border)"}`,
                                    color: activeFilter === f ? "white" : "var(--text-secondary)",
                                    boxShadow: activeFilter === f ? "0 4px 15px rgba(139, 92, 246, 0.3)" : "none",
                                }}
                            >
                                {f === "all" ? "All" : f === "scholarship" ? "💰 Scholarships" : f === "program" ? "📚 Programs" : "🌍 Exchanges"}
                            </button>
                        ))}
                    </div>

                    {/* Cards */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFilter}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
                        >
                            {filteredBacheca.map((entry, i) => {
                                const tc = typeConfig[entry.type];
                                return (
                                    <motion.a
                                        key={entry.id}
                                        href={entry.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08, duration: 0.4 }}
                                        className="glass-card p-6 block group"
                                        style={{ textDecoration: "none", borderLeft: `3px solid ${tc.color}` }}
                                    >
                                        {/* Type badge + location */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span
                                                className="text-xs font-bold px-3 py-1 rounded-full"
                                                style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}
                                            >
                                                {tc.label}
                                            </span>
                                            {entry.location && (
                                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                                    📍 {entry.location}
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                                            {entry.title}
                                            <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-muted)" }}>↗</span>
                                        </h3>

                                        {/* Desc */}
                                        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                                            {entry.description}
                                        </p>

                                        {/* Deadline */}
                                        {entry.deadline && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold" style={{ color: "var(--accent-rose)" }}>
                                                    ⏰ Deadline:
                                                </span>
                                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                                    {entry.deadline}
                                                </span>
                                            </div>
                                        )}
                                    </motion.a>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>

                    {/* Coming soon note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center py-8"
                    >
                        <div
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
                            style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--glass-border)",
                            }}
                        >
                            <motion.span
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-xl"
                            >
                                ✨
                            </motion.span>
                            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                More opportunities coming soon — check back regularly!
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
