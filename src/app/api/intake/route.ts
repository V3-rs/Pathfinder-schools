import { NextRequest, NextResponse } from "next/server";
import { matchArchetypesByKeywords } from "@/lib/archetypes";
import { addSubmission } from "@/lib/store";
import { getSupabaseAdmin } from "@/lib/supabase";
import { matchCareersFromText } from "@/lib/careers";

function combineQuestionnaireAnswers(answers: Record<string, string>): string {
  return Object.values(answers).filter(Boolean).join(" ");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dream_text, questionnaire } = body;

    const combinedText = questionnaire
      ? combineQuestionnaireAnswers(questionnaire)
      : dream_text || "";

    const trimmed = (typeof combinedText === "string" ? combinedText : "").trim();
    const minLen = questionnaire ? 20 : 2;
    if (trimmed.length < minLen) {
      return NextResponse.json(
        { error: questionnaire ? "Please complete the questionnaire" : "Enter at least 2 characters" },
        { status: 400 }
      );
    }

    let embedding: number[] | undefined;
    if (process.env.OPENAI_API_KEY) {
      try {
        const { getEmbedding } = await import("@/lib/embeddings");
        embedding = await getEmbedding(trimmed);
      } catch (_) {
        // Continue without embedding
      }
    }

    let submissionId: string;

    const admin = getSupabaseAdmin();
    if (admin) {
      const embeddingFormatted = embedding ? `[${embedding.join(",")}]` : null;
      const { data: sub, error } = await admin.from("submissions").insert({
        dream_text: trimmed,
        embedding: embeddingFormatted,
      }).select("id").single();

      if (error) throw error;
      submissionId = sub!.id;
    } else {
      const sub = addSubmission(trimmed, embedding);
      submissionId = sub.id;
    }

    const archetypes = matchArchetypesByKeywords(trimmed);
    const matchedCareerIds = matchCareersFromText(trimmed);

    return NextResponse.json({
      submission_id: submissionId,
      archetypes: archetypes.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        score: a.score,
      })),
      matched_career_ids: matchedCareerIds,
    });
  } catch (e) {
    console.error("Intake error:", e);
    return NextResponse.json({ error: "Intake failed" }, { status: 500 });
  }
}
