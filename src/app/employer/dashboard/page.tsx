"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface Insights {
    total_submissions: number;
    top_archetypes: { id: string; label: string; count: number }[];
    top_keywords: { word: string; count: number }[];
    industry_interests: { industry: string; score: number }[];
    top_skills: { skill: string; count: number }[];
    sector_demand: { sector: string; demand: number }[];
}

interface UsageStats {
    total_users: number;
    logged_in_users: number;
    login_rate: number;
}

export default function EmployerDashboardPage() {
    const [insights, setInsights] = useState<Insights | null>(null);
    const [usage, setUsage] = useState<UsageStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Auth check
        if (typeof window !== "undefined") {
            const auth = localStorage.getItem("employer_auth");
            if (!auth) {
                router.push("/employer/login");
                return;
            }
            try {
                const parsed = JSON.parse(auth);
                if (!parsed.loggedIn) {
                    router.push("/employer/login");
                    return;
                }
            } catch {
                router.push("/employer/login");
                return;
            }
        }

        // Fetch insights + usage stats
        Promise.all([
            fetch("/api/employer/insights").then((r) => r.json()),
            fetch("/api/track").then((r) => r.json()).catch(() => ({ total_users: 0, logged_in_users: 0, login_rate: 0 })),
        ])
            .then(([insightsData, usageData]) => {
                setInsights(insightsData);
                setUsage(usageData);
            })
            .catch((err) => {
                setError(err?.message || "Failed to load insights");
            })
            .finally(() => setLoading(false));
    }, [router]);

    function handleLogout() {
        localStorage.removeItem("employer_auth");
        router.push("/employer/login");
    }

    const maxIndustry = insights?.industry_interests?.[0]?.score || 1;
    const maxKeyword = insights?.top_keywords?.[0]?.count || 1;
    const maxSkill = insights?.top_skills?.[0]?.count || 1;

    return (
        <main className="min-h-screen relative z-10">
            {/* Header */}
            <header className="glass-strong" style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🏢</span>
                        <h1 className="text-xl font-bold gradient-text">Employer Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="nav-link">← Pathfinder</Link>
                        <button
                            onClick={handleLogout}
                            className="btn-ghost text-sm"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <svg className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: "var(--accent-violet)" }} fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <p style={{ color: "var(--text-muted)" }}>Loading analytics...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="glass-card p-6 text-center">
                        <p style={{ color: "var(--accent-rose)" }}>{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Top Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            {[
                                { label: "Total Submissions", value: insights?.total_submissions ?? 0, icon: "📊", color: "var(--accent-violet)" },
                                { label: "Platform Users", value: usage?.total_users ?? 0, icon: "👥", color: "var(--accent-emerald)" },
                                { label: "Login Rate", value: `${usage?.login_rate ?? 0}%`, icon: "📈", color: "var(--accent-gold)" },
                                { label: "Top Interest", value: insights?.industry_interests?.[0]?.industry ?? "N/A", icon: "🎯", color: "var(--accent-blue)" },
                                { label: "Top Archetype", value: insights?.top_archetypes?.[0]?.label ?? "N/A", icon: "🧬", color: "#c084fc" },
                                { label: "Top Skill", value: insights?.top_skills?.[0]?.skill ?? "N/A", icon: "⚡", color: "var(--accent-rose)" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card p-5"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{stat.icon}</span>
                                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                                    </div>
                                    <p className="text-2xl font-bold" style={{ color: stat.color }}>
                                        {typeof stat.value === "number" ? stat.value : stat.value}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Industry Interests */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-card p-6"
                            >
                                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                                    <span>🎯</span> Student Industry Interests
                                </h2>
                                {insights?.industry_interests?.length ? (
                                    <div className="space-y-3">
                                        {insights.industry_interests.map((item, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span style={{ color: "var(--text-secondary)" }}>{item.industry}</span>
                                                    <span style={{ color: "var(--accent-gold)" }}>{item.score} mentions</span>
                                                </div>
                                                <div className="stat-bar">
                                                    <motion.div
                                                        className="stat-bar-fill"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(item.score / maxIndustry) * 100}%` }}
                                                        transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                                                        style={{ background: "linear-gradient(90deg, var(--accent-violet), var(--accent-gold))" }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No data yet. Students need to submit the questionnaire.</p>
                                )}
                            </motion.div>

                            {/* Archetype Distribution */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="glass-card p-6"
                            >
                                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                                    <span>🧬</span> Student Archetypes
                                </h2>
                                {insights?.top_archetypes?.length ? (
                                    <div className="space-y-4">
                                        {insights.top_archetypes.map((arch, i) => {
                                            const maxArch = insights.top_archetypes[0]?.count || 1;
                                            const colors = ["var(--accent-violet)", "var(--accent-gold)", "var(--accent-emerald)", "var(--accent-blue)", "var(--accent-rose)"];
                                            return (
                                                <div key={i}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span style={{ color: "var(--text-secondary)" }}>{arch.label}</span>
                                                        <span style={{ color: colors[i % colors.length] }}>{arch.count}</span>
                                                    </div>
                                                    <div className="stat-bar">
                                                        <motion.div
                                                            className="stat-bar-fill"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(arch.count / maxArch) * 100}%` }}
                                                            transition={{ delay: 0.35 + i * 0.05, duration: 0.8 }}
                                                            style={{ background: colors[i % colors.length] }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No archetype data available yet.</p>
                                )}
                            </motion.div>

                            {/* Top Skills */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="glass-card p-6"
                            >
                                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                                    <span>⚡</span> Top Skills Students List
                                </h2>
                                {insights?.top_skills?.length ? (
                                    <div className="space-y-3">
                                        {insights.top_skills.map((item, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span style={{ color: "var(--text-secondary)" }}>{item.skill}</span>
                                                    <span style={{ color: "var(--accent-emerald)" }}>{item.count}×</span>
                                                </div>
                                                <div className="stat-bar">
                                                    <motion.div
                                                        className="stat-bar-fill"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(item.count / maxSkill) * 100}%` }}
                                                        transition={{ delay: 0.4 + i * 0.04, duration: 0.8 }}
                                                        style={{ background: "linear-gradient(90deg, var(--accent-emerald), var(--accent-blue))" }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No skill data yet.</p>
                                )}
                            </motion.div>

                            {/* Sector Demand */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="glass-card p-6"
                            >
                                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                                    <span>📈</span> Internship Sector Demand
                                </h2>
                                <div className="space-y-3">
                                    {insights?.sector_demand?.map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span style={{ color: "var(--text-secondary)" }}>{item.sector}</span>
                                                <span style={{ color: "var(--accent-blue)" }}>{item.demand}%</span>
                                            </div>
                                            <div className="stat-bar">
                                                <motion.div
                                                    className="stat-bar-fill"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.demand}%` }}
                                                    transition={{ delay: 0.45 + i * 0.05, duration: 0.8 }}
                                                    style={{ background: "linear-gradient(90deg, var(--accent-blue), var(--accent-violet))" }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Top Keywords - Full Width */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="glass-card p-6 lg:col-span-2"
                            >
                                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                                    <span>🔤</span> Trending Keywords from Student Submissions
                                </h2>
                                {insights?.top_keywords?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {insights.top_keywords.map((kw, i) => {
                                            const size = Math.max(0.8, (kw.count / maxKeyword) * 1.4);
                                            return (
                                                <motion.span
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.5 + i * 0.03 }}
                                                    className="px-4 py-2 rounded-xl font-medium"
                                                    style={{
                                                        fontSize: `${size}rem`,
                                                        background: i < 3 ? "var(--accent-violet-dim)" : i < 6 ? "var(--accent-gold-dim)" : "var(--bg-card)",
                                                        border: `1px solid ${i < 3 ? "rgba(139, 92, 246, 0.2)" : i < 6 ? "rgba(245, 183, 49, 0.2)" : "var(--glass-border)"}`,
                                                        color: i < 3 ? "#c084fc" : i < 6 ? "var(--accent-gold)" : "var(--text-secondary)",
                                                    }}
                                                >
                                                    {kw.word}
                                                    <span className="text-xs ml-1 opacity-60">({kw.count})</span>
                                                </motion.span>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No keyword data yet. Students need to submit the questionnaire.</p>
                                )}
                            </motion.div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
