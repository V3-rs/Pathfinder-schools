import { NextRequest, NextResponse } from "next/server";
import { deleteSubmission } from "@/lib/store";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const admin = getSupabaseAdmin();
    if (admin) {
      const { error } = await admin.from("submissions").delete().eq("id", id);
      if (error) throw error;
      return NextResponse.json({ deleted: true });
    }

    const ok = deleteSubmission(id);
    return NextResponse.json({ deleted: ok });
  } catch (e) {
    console.error("Delete submission error:", e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
