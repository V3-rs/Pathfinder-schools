import { NextRequest, NextResponse } from "next/server";
import { getSubmission } from "@/lib/store";
import { matchArchetypesByKeywords } from "@/lib/archetypes";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await params;

    let dreamText: string | undefined;

    const admin = getSupabaseAdmin();
    if (admin) {
      const { data, error } = await admin
        .from("submissions")
        .select("dream_text")
        .eq("id", submissionId)
        .single();
      if (error || !data) {
        return NextResponse.json({ error: "Submission not found" }, { status: 404 });
      }
      dreamText = data.dream_text;
    } else {
      const sub = getSubmission(submissionId);
      if (!sub) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
      dreamText = sub.dream_text;
    }

    if (!dreamText) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

    const archetypes = matchArchetypesByKeywords(dreamText);

    return NextResponse.json({
      archetypes: archetypes.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        score: a.score,
      })),
    });
  } catch (e) {
    console.error("Recommendations error:", e);
    return NextResponse.json({ error: "Recommendations failed" }, { status: 500 });
  }
}
