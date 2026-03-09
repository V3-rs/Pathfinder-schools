import { NextResponse } from "next/server";
import { UMAP } from "umap-js";
import { CAREER_PATHS } from "@/lib/careers";

// In-memory cache for embeddings (persists across requests in same process)
const embeddingsCache = new Map<string, number[][]>();

async function getCareerEmbeddings(): Promise<number[][]> {
  const cacheKey = "careers";
  const cached = embeddingsCache.get(cacheKey);
  if (cached) return cached.map((e) => [...e]);

  if (!process.env.OPENAI_API_KEY) {
    return [];
  }

  try {
    const { getEmbedding } = await import("@/lib/embeddings");
    const embeddings: number[][] = [];
    for (const career of CAREER_PATHS) {
      const emb = await getEmbedding(career.title + " " + career.source);
      embeddings.push(emb);
    }
    embeddingsCache.set(cacheKey, embeddings);
    return embeddings;
  } catch (e) {
    console.error("Career embeddings error:", e);
    return [];
  }
}

export async function GET() {
  try {
    const embeddings = await getCareerEmbeddings();
    if (embeddings.length === 0 || embeddings.length !== CAREER_PATHS.length) {
      return NextResponse.json({ error: "Embeddings unavailable", fallback: true });
    }

    const umap = new UMAP({
      nComponents: 2,
      nNeighbors: Math.min(15, Math.floor(embeddings.length / 2)),
      minDist: 0.1,
      spread: 1.0,
    });

    const positions2d = umap.fit(embeddings) as number[][];

    // Normalize to 0-100 range for percentage-based layout (center ~50)
    const xs = positions2d.map((p) => p[0]);
    const ys = positions2d.map((p) => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    const positions = positions2d.map(([x, y]) => ({
      x: 8 + ((x - minX) / rangeX) * 84,
      y: 8 + ((y - minY) / rangeY) * 84,
    }));

    return NextResponse.json({ positions });
  } catch (e) {
    console.error("UMAP error:", e);
    return NextResponse.json({ error: "UMAP failed", fallback: true });
  }
}
