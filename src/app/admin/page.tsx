"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Submission {
  id: string;
  dream_text: string;
  created_at: string;
  embedding?: number[] | null;
}

interface Insights {
  total_submissions: number;
  top_archetypes: { id: string; count: number }[];
  top_keywords: { word: string; count: number }[];
  summary_archetypes: { id: string; title: string; score: number }[];
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  age: number;
  registeredAt: string;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "students">("dashboard");

  function loadData() {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch("/api/admin/submissions").then((r) => (r.ok ? r.json() : r.json().then((j) => { throw new Error(j.error || "Failed to load"); }))),
      fetch("/api/admin/insights").then((r) => (r.ok ? r.json() : r.json().then((j) => { throw new Error(j.error || "Failed to load"); }))),
      fetch("/api/students/register").then((r) => r.json()).catch(() => ({ students: [] })),
    ])
      .then(([subData, insData, stuData]) => {
        setSubmissions(subData?.submissions ?? []);
        setInsights(insData?.total_submissions !== undefined ? insData : null);
        setStudents(stuData?.students ?? []);
      })
      .catch((err) => {
        setError(err?.message ?? "Could not load admin data.");
        setSubmissions([]);
        setInsights(null);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => loadData(), []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this submission?")) return;
    const res = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
    if (res.ok) loadData();
  }

  const archetypeLabels: Record<string, string> = {
    tech: "Tech Innovator",
    research: "Research Pioneer",
    impact: "Social Impact",
    creative: "Creative",
    business: "Business Builder",
  };

  // City breakdown for students
  const cityBreakdown = students.reduce<Record<string, number>>((acc, s) => {
    const c = s.city || "Unknown";
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  const ageBreakdown = students.reduce<Record<string, number>>((acc, s) => {
    const bracket = s.age < 18 ? "Under 18" : s.age <= 22 ? "18-22" : s.age <= 26 ? "23-26" : "27+";
    acc[bracket] = (acc[bracket] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen relative z-10">
      <header className="glass-strong" style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold gradient-text">Pathfinder · Admin</h1>
          <div className="flex items-center gap-2">
            <Link href="/" className="nav-link">← Student intake</Link>
            <Link href="/resources" className="nav-link">Resources</Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl" style={{ background: "var(--accent-gold-dim)", border: "1px solid rgba(245, 183, 49, 0.2)" }}>
            <p className="font-medium" style={{ color: "var(--accent-gold)" }}>Could not load dashboard</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{error}</p>
            <button onClick={loadData} className="mt-3 text-sm font-medium" style={{ color: "var(--accent-gold)" }}>Retry</button>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8">
          {(["dashboard", "students"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: activeTab === tab
                  ? "linear-gradient(135deg, var(--accent-violet), #a855f7)"
                  : "var(--bg-card)",
                border: `1px solid ${activeTab === tab ? "rgba(139, 92, 246, 0.4)" : "var(--glass-border)"}`,
                color: activeTab === tab ? "white" : "var(--text-secondary)",
                boxShadow: activeTab === tab ? "0 4px 15px rgba(139, 92, 246, 0.3)" : "none",
              }}
            >
              {tab === "dashboard" ? `📊 Dashboard (${submissions.length})` : `👥 Students (${students.length})`}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" ? (
          <>
            {/* Dashboard */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 gradient-text-violet">Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Total submissions</h3>
                  <p className="text-3xl font-bold" style={{ color: "var(--accent-gold)" }}>{insights?.total_submissions ?? 0}</p>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>Top archetypes</h3>
                  <div className="space-y-2">
                    {insights?.top_archetypes?.length ? (
                      insights.top_archetypes.map((a) => (
                        <div key={a.id} className="flex justify-between text-sm">
                          <span style={{ color: "var(--text-secondary)" }}>{archetypeLabels[a.id] || a.id}</span>
                          <span className="font-semibold" style={{ color: "var(--accent-violet)" }}>{a.count}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>No data yet</p>
                    )}
                  </div>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>Top keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {insights?.top_keywords?.length ? (
                      insights.top_keywords.map((k) => (
                        <span key={k.word} className="badge badge-gold">
                          {k.word} ({k.count})
                        </span>
                      ))
                    ) : (
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>No data yet</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Submissions */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Submissions ({submissions.length})
              </h2>
              {loading ? (
                <p style={{ color: "var(--text-muted)" }}>Loading...</p>
              ) : submissions.length === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>No submissions yet. Try the intake form.</p>
              ) : (
                <div className="space-y-4">
                  {submissions.map((s, i) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card p-4 flex justify-between items-start gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate max-w-2xl" style={{ color: "var(--text-primary)" }}>{s.dream_text}</p>
                        <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                          {new Date(s.created_at).toLocaleString()}
                          {s.embedding && " · ✓ embedded"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                        style={{ color: "var(--accent-rose)", background: "var(--accent-rose-dim)" }}
                      >
                        Delete
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          /* ─── Students Tab ─── */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-6 gradient-text-violet">Registered Students</h2>

            {/* Student Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6">
                <h3 className="text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Total Students</h3>
                <p className="text-3xl font-bold" style={{ color: "var(--accent-emerald)" }}>{students.length}</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>By City</h3>
                <div className="space-y-2">
                  {Object.entries(cityBreakdown)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([city, count]) => (
                      <div key={city} className="flex justify-between text-sm">
                        <span style={{ color: "var(--text-secondary)" }}>{city}</span>
                        <span className="font-semibold" style={{ color: "var(--accent-blue)" }}>{count}</span>
                      </div>
                    ))}
                  {Object.keys(cityBreakdown).length === 0 && (
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No data yet</p>
                  )}
                </div>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>Age Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(ageBreakdown)
                    .sort((a, b) => {
                      const order = ["Under 18", "18-22", "23-26", "27+"];
                      return order.indexOf(a[0]) - order.indexOf(b[0]);
                    })
                    .map(([bracket, count]) => (
                      <div key={bracket} className="flex justify-between text-sm">
                        <span style={{ color: "var(--text-secondary)" }}>{bracket}</span>
                        <span className="font-semibold" style={{ color: "var(--accent-gold)" }}>{count}</span>
                      </div>
                    ))}
                  {Object.keys(ageBreakdown).length === 0 && (
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No data yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Student List */}
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              All Students
            </h3>
            {loading ? (
              <p style={{ color: "var(--text-muted)" }}>Loading...</p>
            ) : students.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <span className="text-4xl block mb-3">👥</span>
                <p className="font-medium mb-1" style={{ color: "var(--text-secondary)" }}>No students registered yet</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Students will appear here after completing registration.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass-card p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ background: "linear-gradient(135deg, var(--accent-violet), #a855f7)", color: "white" }}
                        >
                          {s.firstName[0]}{s.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                            {s.firstName} {s.lastName}
                          </p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="badge badge-blue">📍 {s.city}</span>
                        <span className="badge badge-gold">🎂 {s.age} yrs</span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {new Date(s.registeredAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
