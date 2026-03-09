import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "kindscale-ai-entries";

export interface Thought {
  id: string;
  text: string;
  createdAt: number;
  prompt?: "challenge" | "deepen" | "question" | "reflect";
}

function loadThoughts(): Thought[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Thought[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveThoughts(thoughts: Thought[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
}

const PROMPTS = {
  challenge: {
    label: "Challenge",
    prefix: "Challenge my thinking and surface blind spots in this:",
    icon: "⚔",
  },
  deepen: {
    label: "Deepen",
    prefix: "Help me go deeper and develop this line of thought:",
    icon: "🔄",
  },
  question: {
    label: "Question",
    prefix: "Ask me probing questions to sharpen this idea:",
    icon: "❓",
  },
  reflect: {
    label: "Reflect",
    prefix: "Reflect this back and help me see assumptions:",
    icon: "🪞",
  },
} as const;

export default function App() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [input, setInput] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<Thought["prompt"]>("challenge");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editPrompt, setEditPrompt] = useState<Thought["prompt"]>("challenge");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setThoughts(loadThoughts());
  }, []);

  useEffect(() => {
    saveThoughts(thoughts);
  }, [thoughts]);

  function addThought() {
    const text = input.trim();
    if (!text) return;
    const thought: Thought = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
      prompt: selectedPrompt,
    };
    setThoughts((prev) => [thought, ...prev]);
    setInput("");
  }

  function removeThought(id: string) {
    setThoughts((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function startEdit(t: Thought) {
    setEditingId(t.id);
    setEditText(t.text);
    setEditPrompt(t.prompt ?? "challenge");
  }

  function saveEdit() {
    if (!editingId) return;
    const text = editText.trim();
    if (!text) {
      removeThought(editingId);
    } else {
      setThoughts((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...t, text, prompt: editPrompt } : t
        )
      );
    }
    setEditingId(null);
  }

  function getCopyText(t: Thought) {
    const p = t.prompt ? PROMPTS[t.prompt] : PROMPTS.challenge;
    return `${p.prefix}\n\n"${t.text}"`;
  }

  async function copyToClipboard(t: Thought) {
    await navigator.clipboard.writeText(getCopyText(t));
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f0fdfa 0%, #faf9f7 40%, #faf9f7 100%)",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          padding: "1rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            Kindscale AI
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--ink-muted)",
              marginTop: 2,
            }}
          >
            Store thoughts. Use AI to sharpen your thinking.
          </p>
        </div>
      </header>

      <section style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "2rem" }}
        >
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--ink-muted)",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Add a thought
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. I believe that good leaders must always be decisive..."
            rows={3}
            style={{
              width: "100%",
              padding: "1rem 1.25rem",
              fontSize: "0.9375rem",
              border: "2px solid var(--border)",
              borderRadius: 12,
              background: "white",
              resize: "vertical",
              outline: "none",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addThought();
              }
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            {(Object.entries(PROMPTS) as [Thought["prompt"], typeof PROMPTS.challenge][]).map(
              ([key, { label, icon }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPrompt(key)}
                  style={{
                    padding: "0.5rem 0.875rem",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    border: `2px solid ${
                      selectedPrompt === key ? "var(--accent)" : "var(--border)"
                    }`,
                    borderRadius: 8,
                    background: selectedPrompt === key ? "var(--accent-light)" : "white",
                    color: selectedPrompt === key ? "var(--accent)" : "var(--ink-muted)",
                    cursor: "pointer",
                  }}
                >
                  {icon} {label}
                </button>
              )
            )}
          </div>
          <button
            onClick={addThought}
            disabled={!input.trim()}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "0.9375rem",
              fontWeight: 600,
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              opacity: input.trim() ? 1 : 0.5,
            }}
          >
            Add thought
          </button>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <AnimatePresence mode="popLayout">
            {thoughts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  border: "2px dashed var(--border)",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.6)",
                }}
              >
                <span style={{ fontSize: "2.5rem" }}>🧠</span>
                <p style={{ color: "var(--ink-muted)", fontSize: "0.9375rem", marginTop: 8 }}>
                  No thoughts yet
                </p>
                <p style={{ color: "var(--ink-muted)", fontSize: "0.8125rem", marginTop: 4 }}>
                  Add one above to start sharpening your thinking
                </p>
              </motion.div>
            ) : (
              thoughts.map((thought) => (
                <motion.div
                  key={thought.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  style={{
                    background: "white",
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow)",
                    overflow: "hidden",
                  }}
                >
                  {editingId === thought.id ? (
                    <div style={{ padding: "1rem 1.25rem" }}>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        autoFocus
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          fontSize: "0.9375rem",
                          border: "2px solid var(--border)",
                          borderRadius: 10,
                          resize: "vertical",
                          outline: "none",
                        }}
                      />
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                        {(Object.keys(PROMPTS) as (keyof typeof PROMPTS)[]).map((p) => (
                          <button
                            key={p}
                            onClick={() => setEditPrompt(p)}
                            style={{
                              padding: "0.375rem 0.75rem",
                              fontSize: "0.75rem",
                              border: `1px solid ${editPrompt === p ? "var(--accent)" : "var(--border)"}`,
                              borderRadius: 6,
                              background: editPrompt === p ? "var(--accent-light)" : "white",
                              cursor: "pointer",
                            }}
                          >
                            {PROMPTS[p].icon}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                        <button
                          onClick={saveEdit}
                          style={{
                            padding: "0.5rem 1rem",
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            background: "var(--accent)",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            padding: "0.5rem 1rem",
                            fontSize: "0.8125rem",
                            background: "transparent",
                            color: "var(--ink-muted)",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          padding: "1rem 1.25rem 0.75rem",
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "1rem",
                        }}
                      >
                        <p
                          style={{
                            flex: 1,
                            fontSize: "0.9375rem",
                            lineHeight: 1.6,
                            color: "var(--ink)",
                            margin: 0,
                          }}
                        >
                          {thought.text}
                        </p>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            onClick={() => copyToClipboard(thought)}
                            title="Copy for AI"
                            style={{
                              padding: 8,
                              border: "none",
                              background: copiedId === thought.id ? "var(--accent-light)" : "transparent",
                              borderRadius: 8,
                              cursor: "pointer",
                            }}
                          >
                            {copiedId === thought.id ? "✓" : "📋"}
                          </button>
                          <button
                            onClick={() => startEdit(thought)}
                            title="Edit"
                            style={{
                              padding: 8,
                              border: "none",
                              background: "transparent",
                              borderRadius: 8,
                              cursor: "pointer",
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => removeThought(thought.id)}
                            title="Remove"
                            style={{
                              padding: 8,
                              border: "none",
                              background: "transparent",
                              borderRadius: 8,
                              cursor: "pointer",
                            }}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "0.5rem 1.25rem 1rem",
                          fontSize: "0.75rem",
                          color: "var(--ink-muted)",
                          borderTop: "1px solid var(--border)",
                        }}
                      >
                        {PROMPTS[thought.prompt ?? "challenge"].icon}{" "}
                        {PROMPTS[thought.prompt ?? "challenge"].label}
                        {" · "}
                        {new Date(thought.createdAt).toLocaleDateString()}
                      </div>
                    </>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {thoughts.length > 0 && (
          <p
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: "0.75rem",
              color: "var(--ink-muted)",
            }}
          >
            Copy a thought and paste into Cursor or any AI chat to develop it
          </p>
        )}
      </section>
    </main>
  );
}
