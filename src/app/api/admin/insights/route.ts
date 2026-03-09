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
    const archetypes = matchArchetypesByKeywords(combined);

    const archetypeCounts: Record<string, number> = {};
    for (const sub of submissions) {
      const matches = matchArchetypesByKeywords(sub.dream_text);
      for (const a of matches) {
        archetypeCounts[a.id] = (archetypeCounts[a.id] || 0) + 1;
      }
    }

    const topArchetypes = Object.entries(archetypeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({ id, count }));

    const stopwords = new Set(["that", "this", "with", "from", "have", "been", "were", "they", "them", "their", "when", "what", "which", "would", "could", "should", "about", "into", "more", "some", "than", "then", "there", "these", "those", "want", "like", "love", "cannot"]);
    const words = combined.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const wordCounts: Record<string, number> = {};
    for (const w of words) {
      if (!stopwords.has(w)) wordCounts[w] = (wordCounts[w] || 0) + 1;
    }
    const topKeywords = Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 12)
      .map(([word, count]) => ({ word, count }));

    return NextResponse.json({
      total_submissions: submissions.length,
      top_archetypes: topArchetypes,
      top_keywords: topKeywords,
      summary_archetypes: archetypes.slice(0, 3),
    });
  } catch (e) {
    console.error("Insights error:", e);
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
  }
}
