"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "career-dreamer-ai-topics";

interface Topic {
  id: string;
  text: string;
  createdAt: number;
}

function loadTopics(): Topic[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Topic[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTopics(topics: Topic[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setTopics(loadTopics());
  }, []);

  useEffect(() => {
    saveTopics(topics);
  }, [topics]);

  function addTopic() {
    const text = input.trim();
    if (!text) return;
    const topic: Topic = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
    };
    setTopics((prev) => [topic, ...prev]);
    setInput("");
  }

  function removeTopic(id: string) {
    setTopics((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function startEdit(id: string, text: string) {
    setEditingId(id);
    setEditText(text);
  }

  function saveEdit() {
    if (!editingId) return;
    const text = editText.trim();
    if (!text) {
      removeTopic(editingId);
    } else {
      setTopics((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, text } : t))
      );
    }
    setEditingId(null);
    setEditText("");
  }

  async function copyToClipboard(topic: Topic) {
    const prompt = `I want to discuss: ${topic.text}`;
    await navigator.clipboard.writeText(prompt);
    setCopiedId(topic.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <main className="min-h-screen overflow-hidden relative z-10">
      <header className="glass-strong" style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold gradient-text">
            Pathfinder
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/internships" className="nav-link">Internships</Link>
            <Link href="/cv-builder" className="nav-link">CV Builder</Link>
            <Link href="/" className="nav-link">Home →</Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-2xl font-bold mb-2 gradient-text-violet">
            Topics to discuss with AI
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Save ideas you want to explore in conversation. Copy any topic and paste it into your favorite AI chat.
          </p>
        </motion.div>

        {/* Add topic input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTopic()}
              placeholder="e.g. How do I pivot from marketing to product management?"
              className="input-dark flex-1"
            />
            <button
              onClick={addTopic}
              disabled={!input.trim()}
              className="btn-primary shrink-0"
            >
              Add
            </button>
          </div>
        </motion.div>

        {/* Topics list */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {topics.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 rounded-2xl"
                style={{ border: "2px dashed var(--glass-border)", background: "var(--bg-card)" }}
              >
                <span className="text-4xl mb-4 block">💭</span>
                <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No topics yet</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Add your first idea above</p>
              </motion.div>
            ) : (
              topics.map((topic, i) => (
                <motion.div
                  key={topic.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    delay: i * 0.03,
                  }}
                  className="group relative"
                >
                  {editingId === topic.id ? (
                    <div className="rounded-2xl p-4" style={{ border: "2px solid rgba(139, 92, 246, 0.3)", background: "var(--bg-secondary)", boxShadow: "0 8px 30px rgba(139, 92, 246, 0.1)" }}>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            saveEdit();
                          }
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        rows={3}
                        autoFocus
                        className="input-dark w-full resize-none"
                      />
                      <div className="flex gap-2 mt-3">
                        <button onClick={saveEdit} className="btn-primary text-xs px-3 py-1.5">Save</button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs font-medium px-3 py-1.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-card p-4 pr-24">
                      <p className="text-sm leading-relaxed pr-2" style={{ color: "var(--text-primary)" }}>
                        {topic.text}
                      </p>
                      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(topic)}
                          title="Copy to clipboard"
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {copiedId === topic.id ? (
                            <svg className="w-4 h-4" style={{ color: "var(--accent-emerald)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => startEdit(topic.id, topic.text)}
                          title="Edit"
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeTopic(topic.id)}
                          title="Remove"
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {topics.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Topics are saved locally in your browser. Hover a card to copy or edit.
          </motion.p>
        )}
      </section>
    </main>
  );
}
