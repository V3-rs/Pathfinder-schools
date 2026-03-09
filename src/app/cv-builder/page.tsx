"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CAREER_PATHS, getCareerById } from "@/lib/careers";

interface Education {
    school: string;
    degree: string;
    year: string;
}

interface Experience {
    company: string;
    role: string;
    duration: string;
    description: string;
}

interface CVData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    targetCareerId: string;
    summary: string;
    education: Education[];
    experience: Experience[];
    skills: string;
}

type TemplateId = "modern" | "classic" | "minimal";

const TEMPLATES: { id: TemplateId; name: string; desc: string; accent: string; font: string }[] = [
    { id: "modern", name: "Modern", desc: "Violet accents, clean layout", accent: "#8b5cf6", font: "'Inter', sans-serif" },
    { id: "classic", name: "Classic", desc: "Navy serif, traditional feel", accent: "#1e3a5f", font: "'Georgia', serif" },
    { id: "minimal", name: "Minimal", desc: "Black & white, ultra-clean", accent: "#111827", font: "'Helvetica', sans-serif" },
];

// Career-specific AI recommendations
const CAREER_RECOMMENDATIONS: Record<string, { suggestedSkills: string[]; keywords: string[]; tips: string[] }> = {
    "software-developer": {
        suggestedSkills: ["Git & Version Control", "REST APIs", "Agile/Scrum", "Unit Testing", "CI/CD Pipelines"],
        keywords: ["full-stack", "scalable", "microservices", "performance optimization", "code review"],
        tips: ["Include links to GitHub projects", "Quantify your impact (e.g., reduced load time by 40%)", "Mention specific frameworks and languages"],
    },
    "data-analyst": {
        suggestedSkills: ["SQL & Python", "Data Visualization (Tableau/PowerBI)", "Statistical Analysis", "Excel Advanced", "ETL Processes"],
        keywords: ["data-driven", "actionable insights", "dashboard", "KPI tracking", "trend analysis"],
        tips: ["Highlight specific business outcomes from your analysis", "Mention dataset sizes you've worked with", "Show proficiency in multiple visualization tools"],
    },
    "digital-marketing-manager": {
        suggestedSkills: ["Google Analytics", "SEO/SEM", "Content Marketing", "Social Media Strategy", "A/B Testing"],
        keywords: ["ROI", "conversion rate", "engagement", "campaign optimization", "brand awareness"],
        tips: ["Include metrics: CTR, conversion rates, ROAS", "Mention budget sizes managed", "Show cross-channel experience"],
    },
    "product-owner": {
        suggestedSkills: ["Stakeholder Management", "User Story Writing", "Sprint Planning", "Roadmapping", "A/B Testing"],
        keywords: ["product vision", "user-centric", "backlog prioritization", "data-driven decisions", "cross-functional"],
        tips: ["Quantify product impact on revenue or user growth", "Mention team sizes led", "Show experience with product analytics tools"],
    },
    "fintech-developer": {
        suggestedSkills: ["API Development", "Mobile Money Integration", "Payment Security", "Database Design", "React Native / Flutter"],
        keywords: ["financial technology", "payment processing", "mobile banking", "USSD", "PCI compliance"],
        tips: ["Highlight experience with African payment platforms (MoMo, Vodafone Cash)", "Mention security certifications", "Show transaction volumes handled"],
    },
    "agribusiness-manager": {
        suggestedSkills: ["Supply Chain Logistics", "Farm Management Software", "Market Analysis", "Negotiation", "Quality Assurance"],
        keywords: ["value chain", "farm-to-market", "export compliance", "crop yield optimization", "sustainable agriculture"],
        tips: ["Mention specific crops/commodities managed", "Include tonnage or revenue figures", "Show understanding of COCOBOD regulations"],
    },
    "ngo-programme-officer": {
        suggestedSkills: ["M&E Frameworks", "Grant Writing", "Stakeholder Engagement", "Budget Management", "SPSS/Stata"],
        keywords: ["impact measurement", "theory of change", "capacity building", "community mobilization", "donor reporting"],
        tips: ["Highlight grant amounts secured", "Show beneficiary numbers reached", "Mention specific donors (USAID, DFID, EU)"],
    },
};

const DEFAULT_RECOMMENDATIONS = {
    suggestedSkills: ["Communication", "Problem Solving", "Teamwork", "Time Management", "Adaptability"],
    keywords: ["results-oriented", "collaborative", "innovative", "detail-oriented", "proactive"],
    tips: ["Use action verbs: Led, Developed, Implemented, Achieved", "Quantify achievements wherever possible", "Tailor your CV to each specific role"],
};

const ACTION_VERBS = [
    "Achieved", "Developed", "Implemented", "Led", "Managed", "Designed",
    "Analyzed", "Coordinated", "Established", "Improved", "Launched",
    "Negotiated", "Optimized", "Spearheaded", "Streamlined", "Transformed",
];

const INITIAL_CV: CVData = {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    targetCareerId: "",
    summary: "",
    education: [{ school: "", degree: "", year: "" }],
    experience: [{ company: "", role: "", duration: "", description: "" }],
    skills: "",
};

function getTemplateStyles(t: TemplateId) {
    switch (t) {
        case "modern": return {
            bg: "white", color: "#1a1a2e", accent: "#8b5cf6", accentLight: "#ede9fe", accentText: "#6d28d9",
            font: "'Inter', 'Segoe UI', sans-serif", headingBorder: "2px solid #c4b5fd",
        };
        case "classic": return {
            bg: "#fefefe", color: "#1e3a5f", accent: "#1e3a5f", accentLight: "#e8eef5", accentText: "#1e3a5f",
            font: "'Georgia', 'Times New Roman', serif", headingBorder: "2px solid #1e3a5f",
        };
        case "minimal": return {
            bg: "white", color: "#111827", accent: "#111827", accentLight: "#f3f4f6", accentText: "#374151",
            font: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", headingBorder: "1px solid #d1d5db",
        };
    }
}

function CVBuilderContent() {
    const searchParams = useSearchParams();
    const previewRef = useRef<HTMLDivElement>(null);
    const [cv, setCv] = useState<CVData>(INITIAL_CV);
    const [template, setTemplate] = useState<TemplateId>("modern");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [showRecs, setShowRecs] = useState(false);

    useEffect(() => {
        const careerId = searchParams.get("career");
        if (careerId) {
            setCv((prev) => ({ ...prev, targetCareerId: careerId }));
        }
    }, [searchParams]);

    const targetCareer = cv.targetCareerId ? getCareerById(cv.targetCareerId) : null;
    const recs = CAREER_RECOMMENDATIONS[cv.targetCareerId] || DEFAULT_RECOMMENDATIONS;

    function updateField(field: keyof CVData, value: string) {
        setCv((prev) => ({ ...prev, [field]: value }));
    }
    function updateEducation(index: number, field: keyof Education, value: string) {
        setCv((prev) => { const ed = [...prev.education]; ed[index] = { ...ed[index], [field]: value }; return { ...prev, education: ed }; });
    }
    function addEducation() {
        setCv((prev) => ({ ...prev, education: [...prev.education, { school: "", degree: "", year: "" }] }));
    }
    function removeEducation(index: number) {
        setCv((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
    }
    function updateExperience(index: number, field: keyof Experience, value: string) {
        setCv((prev) => { const exp = [...prev.experience]; exp[index] = { ...exp[index], [field]: value }; return { ...prev, experience: exp }; });
    }
    function addExperience() {
        setCv((prev) => ({ ...prev, experience: [...prev.experience, { company: "", role: "", duration: "", description: "" }] }));
    }
    function removeExperience(index: number) {
        setCv((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
    }

    function addSkillFromRec(skill: string) {
        const current = cv.skills.split(",").map(s => s.trim()).filter(Boolean);
        if (!current.includes(skill)) {
            updateField("skills", [...current, skill].join(", "));
        }
    }

    async function handleAIEnhance() {
        setAiLoading(true);
        setAiError(null);
        try {
            const res = await fetch("/api/cv/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: cv.fullName,
                    targetCareerId: cv.targetCareerId,
                    skills: cv.skills,
                    experience: cv.experience,
                    education: cv.education,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to enhance CV");
            if (data.summary) setCv((prev) => ({ ...prev, summary: data.summary }));
            if (data.skills) setCv((prev) => ({ ...prev, skills: data.skills }));
        } catch (err) {
            setAiError(err instanceof Error ? err.message : "AI enhancement failed");
        } finally {
            setAiLoading(false);
        }
    }

    function handleDownloadPDF() {
        const content = previewRef.current;
        if (!content) return;
        const s = getTemplateStyles(template);
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.document.write(`<!DOCTYPE html>
<html><head><title>${cv.fullName || "CV"} - Resume</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: ${s.font}; color: ${s.color}; background: white; padding: 40px; line-height: 1.6; }
  @media print { body { padding: 20px; } }
</style></head><body>${content.innerHTML}</body></html>`);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 300);
    }

    const skillsList = cv.skills.split(",").map((s) => s.trim()).filter(Boolean);
    const s = getTemplateStyles(template);

    return (
        <main className="min-h-screen relative z-10">
            <header className="glass-strong" style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-lg font-bold gradient-text">Pathfinder</Link>
                    <div className="flex items-center gap-2">
                        <Link href="/topics" className="nav-link">AI Topics</Link>
                        <Link href="/internships" className="nav-link">Internships</Link>
                        <Link href="/" className="nav-link">Explorer →</Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <h1 className="text-3xl font-bold gradient-text-violet mb-2">CV Builder</h1>
                    <p style={{ color: "var(--text-secondary)" }}>
                        Build a professional CV tailored to your target career. Choose a template and get AI-powered suggestions.
                    </p>
                </motion.div>

                {/* Template Selector */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
                    <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--accent-gold)" }}>Choose Template</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {TEMPLATES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTemplate(t.id)}
                                className="relative p-4 rounded-xl text-left transition-all"
                                style={{
                                    background: template === t.id ? "var(--accent-violet-dim)" : "var(--bg-card)",
                                    border: template === t.id ? "2px solid rgba(139, 92, 246, 0.4)" : "2px solid var(--glass-border)",
                                    boxShadow: template === t.id ? "0 4px 20px rgba(139, 92, 246, 0.15)" : "none",
                                }}
                            >
                                {template === t.id && (
                                    <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-violet)", color: "white" }}>Active</span>
                                )}
                                {/* Mini preview bar */}
                                <div className="h-8 w-full rounded-md mb-3 flex items-end p-1 gap-0.5" style={{ background: "white", border: "1px solid #e5e7eb" }}>
                                    <div className="h-2 rounded" style={{ width: "60%", background: t.accent }} />
                                    <div className="h-1.5 rounded" style={{ width: "30%", background: "#e5e7eb" }} />
                                </div>
                                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Side */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
                        {/* Target Career */}
                        <div className="glass-card p-5">
                            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--accent-gold)" }}>Target Career</h2>
                            <select value={cv.targetCareerId} onChange={(e) => updateField("targetCareerId", e.target.value)} className="input-dark w-full">
                                <option value="">Select a career to target...</option>
                                {CAREER_PATHS.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
                            </select>
                            {targetCareer && (
                                <div className="mt-3 p-3 rounded-xl" style={{ background: "var(--accent-gold-dim)", border: "1px solid rgba(245, 183, 49, 0.15)" }}>
                                    <p className="text-sm" style={{ color: "var(--accent-gold)" }}>
                                        <strong>{targetCareer.title}</strong>
                                        {targetCareer.salaryRange && ` · ${targetCareer.salaryRange}`}
                                    </p>
                                    {targetCareer.education && (
                                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Typical education: {targetCareer.education}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* AI Recommendations Toggle */}
                        <div className="glass-card p-5">
                            <button onClick={() => setShowRecs(!showRecs)} className="w-full flex items-center justify-between">
                                <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--accent-emerald)" }}>
                                    🤖 AI Recommendations
                                </h2>
                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{showRecs ? "▲ Hide" : "▼ Show"}</span>
                            </button>
                            {showRecs && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-4">
                                    {/* Suggested Skills */}
                                    <div>
                                        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Suggested Skills — click to add:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {recs.suggestedSkills.map((skill) => (
                                                <button key={skill} onClick={() => addSkillFromRec(skill)}
                                                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                                                    style={{
                                                        background: skillsList.includes(skill) ? "var(--accent-emerald)" : "var(--bg-secondary)",
                                                        color: skillsList.includes(skill) ? "white" : "var(--text-secondary)",
                                                        border: `1px solid ${skillsList.includes(skill) ? "transparent" : "var(--glass-border)"}`,
                                                    }}
                                                >
                                                    {skillsList.includes(skill) ? "✓ " : "+ "}{skill}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Keywords */}
                                    <div>
                                        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Industry Keywords to use:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {recs.keywords.map((kw) => (
                                                <span key={kw} className="text-xs px-2 py-1 rounded-md" style={{ background: "var(--accent-violet-dim)", color: "#c084fc", border: "1px solid rgba(139,92,246,0.2)" }}>
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Tips */}
                                    <div>
                                        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Pro Tips:</p>
                                        <ul className="space-y-1.5">
                                            {recs.tips.map((tip, i) => (
                                                <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                                                    <span style={{ color: "var(--accent-gold)" }}>💡</span> {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Action verbs */}
                                    <div>
                                        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Strong Action Verbs:</p>
                                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                            {ACTION_VERBS.join(" · ")}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Personal Info */}
                        <div className="glass-card p-5">
                            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--accent-gold)" }}>Personal Information</h2>
                            <div className="space-y-3">
                                <input type="text" placeholder="Full Name" value={cv.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="input-dark w-full" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="email" placeholder="Email" value={cv.email} onChange={(e) => updateField("email", e.target.value)} className="input-dark w-full" />
                                    <input type="tel" placeholder="Phone" value={cv.phone} onChange={(e) => updateField("phone", e.target.value)} className="input-dark w-full" />
                                </div>
                                <input type="text" placeholder="Location (e.g. Accra, Ghana)" value={cv.location} onChange={(e) => updateField("location", e.target.value)} className="input-dark w-full" />
                            </div>
                        </div>

                        {/* Professional Summary */}
                        <div className="glass-card p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--accent-gold)" }}>Professional Summary</h2>
                                <button onClick={handleAIEnhance} disabled={aiLoading} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
                                    {aiLoading ? (
                                        <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Enhancing...</>
                                    ) : "✨ AI Enhance"}
                                </button>
                            </div>
                            {aiError && <p className="text-xs mb-2" style={{ color: "var(--accent-rose)" }}>{aiError}</p>}
                            <textarea placeholder="Write a brief professional summary, or click 'AI Enhance' to generate one..." value={cv.summary} onChange={(e) => updateField("summary", e.target.value)} rows={4} className="input-dark w-full resize-none" />
                        </div>

                        {/* Education */}
                        <div className="glass-card p-5">
                            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--accent-gold)" }}>Education</h2>
                            {cv.education.map((edu, i) => (
                                <div key={i} className="mb-4 last:mb-0">
                                    {i > 0 && <div className="mb-3" style={{ borderTop: "1px solid var(--glass-border)" }} />}
                                    <div className="space-y-2">
                                        <input type="text" placeholder="School / University" value={edu.school} onChange={(e) => updateEducation(i, "school", e.target.value)} className="input-dark w-full text-sm" />
                                        <div className="grid grid-cols-3 gap-2">
                                            <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} className="input-dark col-span-2 text-sm" />
                                            <input type="text" placeholder="Year" value={edu.year} onChange={(e) => updateEducation(i, "year", e.target.value)} className="input-dark text-sm" />
                                        </div>
                                        {cv.education.length > 1 && <button onClick={() => removeEducation(i)} className="text-xs" style={{ color: "var(--accent-rose)" }}>Remove</button>}
                                    </div>
                                </div>
                            ))}
                            <button onClick={addEducation} className="mt-2 text-sm font-medium" style={{ color: "var(--accent-violet)" }}>+ Add Education</button>
                        </div>

                        {/* Experience */}
                        <div className="glass-card p-5">
                            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--accent-gold)" }}>Experience</h2>
                            {cv.experience.map((exp, i) => (
                                <div key={i} className="mb-4 last:mb-0">
                                    {i > 0 && <div className="mb-3" style={{ borderTop: "1px solid var(--glass-border)" }} />}
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} className="input-dark text-sm" />
                                            <input type="text" placeholder="Role" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} className="input-dark text-sm" />
                                        </div>
                                        <input type="text" placeholder="Duration (e.g. Jun 2024 – Present)" value={exp.duration} onChange={(e) => updateExperience(i, "duration", e.target.value)} className="input-dark w-full text-sm" />
                                        <textarea placeholder="Describe your responsibilities..." value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} rows={3} className="input-dark w-full text-sm resize-none" />
                                        {cv.experience.length > 1 && <button onClick={() => removeExperience(i)} className="text-xs" style={{ color: "var(--accent-rose)" }}>Remove</button>}
                                    </div>
                                </div>
                            ))}
                            <button onClick={addExperience} className="mt-2 text-sm font-medium" style={{ color: "var(--accent-violet)" }}>+ Add Experience</button>
                        </div>

                        {/* Skills */}
                        <div className="glass-card p-5">
                            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--accent-gold)" }}>Skills</h2>
                            <textarea placeholder="Enter skills separated by commas (e.g. JavaScript, Python, Data Analysis)" value={cv.skills} onChange={(e) => updateField("skills", e.target.value)} rows={3} className="input-dark w-full resize-none" />
                            {targetCareer && (
                                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                                    💡 Relevant for <strong style={{ color: "var(--accent-gold)" }}>{targetCareer.title}</strong>:{" "}
                                    {targetCareer.growthAreas.map((g) => g.skill).join(", ")}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Preview Side */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:sticky lg:top-8 lg:self-start">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Live Preview</h2>
                            <button onClick={handleDownloadPDF} disabled={!cv.fullName} className="btn-gold text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download PDF
                            </button>
                        </div>

                        <div
                            ref={previewRef}
                            className="p-8 rounded-2xl min-h-[600px]"
                            style={{ background: s.bg, color: s.color, fontFamily: s.font, boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
                        >
                            <h1 style={{ fontSize: "28px", fontWeight: "bold", color: s.color, marginBottom: "4px" }}>
                                {cv.fullName || "Your Name"}
                            </h1>
                            <p style={{ fontSize: "13px", color: "#666", marginBottom: "16px" }}>
                                {[cv.email, cv.phone, cv.location].filter(Boolean).join(" · ") || "email@example.com · +233 XX XXX XXXX · Accra, Ghana"}
                            </p>

                            {cv.summary && (
                                <>
                                    <h2 style={{ fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", color: s.accent, borderBottom: s.headingBorder, paddingBottom: "4px", marginTop: "24px", marginBottom: "12px" }}>Professional Summary</h2>
                                    <p style={{ fontSize: "14px", color: "#444", lineHeight: 1.6 }}>{cv.summary}</p>
                                </>
                            )}

                            {cv.experience.some((e) => e.company || e.role) && (
                                <>
                                    <h2 style={{ fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", color: s.accent, borderBottom: s.headingBorder, paddingBottom: "4px", marginTop: "24px", marginBottom: "12px" }}>Experience</h2>
                                    {cv.experience.filter((e) => e.company || e.role).map((exp, i) => (
                                        <div key={i} style={{ marginBottom: "16px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: s.color }}>{exp.role || "Role"}</h3>
                                                <span style={{ fontSize: "13px", color: "#888" }}>{exp.duration}</span>
                                            </div>
                                            <p style={{ fontSize: "13px", color: s.accent, fontWeight: 600 }}>{exp.company}</p>
                                            {exp.description && <p style={{ fontSize: "14px", color: "#444", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
                                        </div>
                                    ))}
                                </>
                            )}

                            {cv.education.some((e) => e.school || e.degree) && (
                                <>
                                    <h2 style={{ fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", color: s.accent, borderBottom: s.headingBorder, paddingBottom: "4px", marginTop: "24px", marginBottom: "12px" }}>Education</h2>
                                    {cv.education.filter((e) => e.school || e.degree).map((edu, i) => (
                                        <div key={i} style={{ marginBottom: "12px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: s.color }}>{edu.degree || "Degree"}</h3>
                                                <span style={{ fontSize: "13px", color: "#888" }}>{edu.year}</span>
                                            </div>
                                            <p style={{ fontSize: "13px", color: s.accent, fontWeight: 600 }}>{edu.school}</p>
                                        </div>
                                    ))}
                                </>
                            )}

                            {skillsList.length > 0 && (
                                <>
                                    <h2 style={{ fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", color: s.accent, borderBottom: s.headingBorder, paddingBottom: "4px", marginTop: "24px", marginBottom: "12px" }}>Skills</h2>
                                    <div>
                                        {skillsList.map((skill, i) => (
                                            <span key={i} style={{ display: "inline-block", background: s.accentLight, color: s.accentText, padding: "2px 10px", borderRadius: "12px", fontSize: "13px", margin: "2px 4px 2px 0" }}>{skill}</span>
                                        ))}
                                    </div>
                                </>
                            )}

                            {!cv.fullName && !cv.summary && !cv.experience.some((e) => e.company) && (
                                <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
                                    <p style={{ fontSize: "36px", marginBottom: "12px" }}>📄</p>
                                    <p style={{ fontSize: "14px" }}>Fill in the form to see your CV preview here</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

export default function CVBuilderPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
                    <p style={{ color: "var(--text-muted)" }}>Loading CV Builder...</p>
                </div>
            }
        >
            <CVBuilderContent />
        </Suspense>
    );
}
