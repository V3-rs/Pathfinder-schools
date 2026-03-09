// Hardcoded archetypes for Week 1 (keyword matching when DB/embeddings unavailable)
export const HARDCODED_ARCHETYPES = [
  {
    id: "tech",
    title: "Tech Innovator",
    description: "Building software, startups, and digital products",
    keywords: ["software", "coding", "startup", "tech", "developer", "programming", "app", "web"],
  },
  {
    id: "research",
    title: "Research Pioneer",
    description: "Academic research, labs, and discovery",
    keywords: ["research", "lab", "phd", "academic", "publish", "experiment", "discovery", "science"],
  },
  {
    id: "impact",
    title: "Social Impact Leader",
    description: "Nonprofits, policy, and community change",
    keywords: ["nonprofit", "policy", "community", "social impact", "advocacy", "justice", "sustainability"],
  },
  {
    id: "creative",
    title: "Creative Professional",
    description: "Design, arts, media, and content",
    keywords: ["design", "art", "creative", "media", "film", "music", "writing", "content"],
  },
  {
    id: "business",
    title: "Business Builder",
    description: "Consulting, finance, and corporate leadership",
    keywords: ["consulting", "finance", "business", "corporate", "management", "leadership", "investment"],
  },
];

export function matchArchetypesByKeywords(text: string) {
  const lower = text.toLowerCase();
  return HARDCODED_ARCHETYPES.map((a) => {
    const matches = a.keywords.filter((k) => lower.includes(k)).length;
    return { ...a, score: matches / a.keywords.length };
  })
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
