// In-memory store for MVP when Supabase isn't configured
export interface Submission {
  id: string;
  dream_text: string;
  embedding?: number[];
  created_at: string;
}

export interface ArchetypeMatch {
  id: string;
  title: string;
  description: string;
  score: number;
}

const submissions: Submission[] = [];

export function addSubmission(dreamText: string, embedding?: number[]): Submission {
  const sub: Submission = {
    id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    dream_text: dreamText,
    embedding,
    created_at: new Date().toISOString(),
  };
  submissions.push(sub);
  return sub;
}

export function getSubmission(id: string): Submission | undefined {
  return submissions.find((s) => s.id === id);
}

export function getAllSubmissions(): Submission[] {
  return [...submissions];
}

export function deleteSubmission(id: string): boolean {
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  submissions.splice(idx, 1);
  return true;
}
