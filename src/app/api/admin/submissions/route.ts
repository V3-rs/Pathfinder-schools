import { NextResponse } from "next/server";
import { getAllSubmissions } from "@/lib/store";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    if (admin) {
      const { data, error } = await admin
        .from("submissions")
        .select("id, dream_text, embedding, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({ submissions: data || [] });
    }

    const submissions = getAllSubmissions();
    return NextResponse.json({
      submissions: submissions.map((s) => ({
        id: s.id,
        dream_text: s.dream_text,
        embedding: s.embedding,
        created_at: s.created_at,
      })),
    });
  } catch (e) {
    console.error("Admin submissions error:", e);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}
