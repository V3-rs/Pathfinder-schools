"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EmployerLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/employer/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem("employer_auth", JSON.stringify({ email, loggedIn: true, timestamp: Date.now() }));
                router.push("/employer/dashboard");
            } else {
                setError(data.error || "Invalid credentials");
            }
        } catch {
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                {/* Back link */}
                <Link href="/" className="nav-link inline-flex items-center gap-1 mb-8">
                    ← Back to Pathfinder
                </Link>

                {/* Login card */}
                <div className="glass-card p-8" style={{ borderRadius: "24px" }}>
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring" }}
                            className="text-5xl mb-4 inline-block"
                        >
                            🏢
                        </motion.div>
                        <h1 className="text-2xl font-bold gradient-text mb-2">Employer Portal</h1>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            Access student insights and analytics
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="employer@pathfinder.com"
                                required
                                className="input-dark w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="input-dark w-full"
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm p-3 rounded-xl"
                                style={{ background: "var(--accent-rose-dim)", color: "var(--accent-rose)", border: "1px solid rgba(244, 114, 182, 0.2)" }}
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : "Sign In →"}
                        </button>
                    </form>


                </div>
            </motion.div>
        </main>
    );
}
