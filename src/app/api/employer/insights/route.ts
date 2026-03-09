import { NextResponse } from "next/server";
import { getAllSubmissions } from "@/lib/store";
import { getSupabaseAdmin } from "@/lib/supabase";
import { matchArchetypesByKeywords } from "@/lib/archetypes";

export async function GET() {
    try {
        let submissions: { dream_text: string }[] = [];

        const admin = getSupabaseAdmin();
        if (admin) {
            const { data, error } = await admin
                .from("submissions")
                .select("dream_text")
                .order("created_at", { ascending: false });
            if (error) throw error;
            submissions = data || [];
        } else {
            submissions = getAllSubmissions().map((s) => ({ dream_text: s.dream_text }));
        }

        const combined = submissions.map((s) => s.dream_text).join(" ");

        // Archetype distribution
        const archetypeCounts: Record<string, number> = {};
        for (const sub of submissions) {
            const matches = matchArchetypesByKeywords(sub.dream_text);
            for (const a of matches) {
                archetypeCounts[a.id] = (archetypeCounts[a.id] || 0) + 1;
            }
        }

        const archetypeLabels: Record<string, string> = {
            tech: "Tech Innovator",
            research: "Research Pioneer",
            impact: "Social Impact",
            creative: "Creative",
            business: "Business Builder",
        };

        const topArchetypes = Object.entries(archetypeCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([id, count]) => ({ id, label: archetypeLabels[id] || id, count }));

        // Keyword extraction
        const stopwords = new Set([
            "that", "this", "with", "from", "have", "been", "were", "they", "them",
            "their", "when", "what", "which", "would", "could", "should", "about",
            "into", "more", "some", "than", "then", "there", "these", "those",
            "want", "like", "love", "cannot", "also", "very", "much", "just",
            "will", "work", "make", "good", "well", "know",
        ]);
        const words = combined.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
        const wordCounts: Record<string, number> = {};
        for (const w of words) {
            if (!stopwords.has(w)) wordCounts[w] = (wordCounts[w] || 0) + 1;
        }
        const topKeywords = Object.entries(wordCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 15)
            .map(([word, count]) => ({ word, count }));

        // Industry interest extraction
        const industryKeywords: Record<string, string[]> = {
            "Technology": ["tech", "software", "programming", "code", "developer", "engineer", "computer", "data"],
            "Finance": ["finance", "banking", "investment", "accounting", "financial", "money", "stock"],
            "Healthcare": ["health", "medical", "hospital", "doctor", "nurse", "clinical", "patient"],
            "Marketing": ["marketing", "brand", "advertising", "social", "content", "campaign", "digital"],
            "Education": ["education", "teaching", "school", "learning", "student", "academic", "university"],
            "Creative": ["design", "creative", "art", "visual", "music", "writing", "media"],
            "Consulting": ["consulting", "strategy", "management", "advisory", "business"],
            "Research": ["research", "science", "academic", "laboratory", "experiment", "study"],
        };

        const industryScores: Record<string, number> = {};
        const lowerText = combined.toLowerCase();
        for (const [industry, keywords] of Object.entries(industryKeywords)) {
            let score = 0;
            for (const kw of keywords) {
                const regex = new RegExp(`\\b${kw}`, "gi");
                const matches = lowerText.match(regex);
                score += matches ? matches.length : 0;
            }
            if (score > 0) industryScores[industry] = score;
        }

        const industryInterests = Object.entries(industryScores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([industry, score]) => ({ industry, score }));

        // Top skills mentioned
        const skillKeywords = [
            "python", "javascript", "excel", "analysis", "communication", "leadership",
            "management", "design", "writing", "research", "coding", "teamwork",
            "problem-solving", "critical", "thinking", "planning", "organization",
            "creativity", "innovation", "data", "machine", "learning",
        ];

        const skillCounts: Record<string, number> = {};
        for (const skill of skillKeywords) {
            const regex = new RegExp(`\\b${skill}`, "gi");
            const matches = lowerText.match(regex);
            if (matches) skillCounts[skill] = matches.length;
        }

        const topSkills = Object.entries(skillCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 12)
            .map(([skill, count]) => ({ skill: skill.charAt(0).toUpperCase() + skill.slice(1), count }));

        // Sector demand (from internship sectors)
        const sectorDemand = [
            { sector: "Tech", demand: 85 },
            { sector: "Finance", demand: 72 },
            { sector: "Marketing", demand: 65 },
            { sector: "Content", demand: 58 },
            { sector: "Business", demand: 50 },
            { sector: "Impact", demand: 42 },
        ];

        return NextResponse.json({
            total_submissions: submissions.length,
            top_archetypes: topArchetypes,
            top_keywords: topKeywords,
            industry_interests: industryInterests,
            top_skills: topSkills,
            sector_demand: sectorDemand,
        });
    } catch (e) {
        console.error("Employer insights error:", e);
        return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
    }
}
