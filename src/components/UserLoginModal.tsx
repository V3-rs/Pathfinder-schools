"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    onContinue: () => void;
}

export default function UserLoginModal({ onContinue }: Props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [age, setAge] = useState("");
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    async function handleRegister() {
        setError("");

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !city.trim() || !age.trim()) {
            setError("Please fill in all fields to create your account.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/students/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    city: city.trim(),
                    age: age.trim(),
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed. Please try again.");
                setSaving(false);
                return;
            }

            // Store locally for session reference
            localStorage.setItem(
                "pathfinder_user",
                JSON.stringify({
                    id: data.student?.id,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    city: city.trim(),
                    age: age.trim(),
                })
            );

            // Track usage
            fetch("/api/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: "platform_use",
                    name: `${firstName.trim()} ${lastName.trim()}`,
                    email: email.trim(),
                    timestamp: new Date().toISOString(),
                }),
            }).catch(() => { });

            setDone(true);
            setTimeout(() => onContinue(), 1200);
        } catch {
            setError("Registration failed. Please try again.");
            setSaving(false);
        }
    }

    async function handleSkip() {
        setSaving(true);
        try {
            const res = await fetch("/api/students/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skip: true }),
            });
            const data = await res.json();

            if (res.ok && data.student) {
                localStorage.setItem(
                    "pathfinder_user",
                    JSON.stringify({
                        id: data.student.id,
                        firstName: data.student.firstName,
                        lastName: data.student.lastName,
                        email: data.student.email,
                        city: data.student.city,
                        age: data.student.age,
                    })
                );
            }

            // Track usage
            fetch("/api/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: "platform_use",
                    name: "Anonymous User",
                    email: null,
                    timestamp: new Date().toISOString(),
                }),
            }).catch(() => { });

            setDone(true);
            setTimeout(() => onContinue(), 1200);
        } catch {
            // Even if tracking fails, just skip
            setDone(true);
            setTimeout(() => onContinue(), 1200);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative z-10">
            <AnimatePresence mode="wait">
                {done ? (
                    <motion.div
                        key="done"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 10 }}
                            className="text-6xl block mb-4"
                        >
                            🎉
                        </motion.span>
                        <h2 className="text-2xl font-bold gradient-text mb-2">Welcome aboard!</h2>
                        <p style={{ color: "var(--text-muted)" }}>Loading your career paths...</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-md"
                    >
                        <div className="text-center mb-8">
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                                className="text-4xl block mb-4"
                            >
                                🧭
                            </motion.span>
                            <h1 className="text-2xl font-bold gradient-text mb-2">
                                Create Your Account
                            </h1>
                            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                Sign up to track your career journey, get personalized updates, and help us measure our impact.
                            </p>
                        </div>

                        <div className="glass-card p-6 space-y-4">
                            {/* First & Last Name row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="John"
                                        className="input-dark w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Doe"
                                        className="input-dark w-full"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="input-dark w-full"
                                />
                            </div>

                            {/* City & Age row */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Your city"
                                        className="input-dark w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="20"
                                        min={13}
                                        max={120}
                                        className="input-dark w-full"
                                    />
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm p-3 rounded-xl"
                                    style={{
                                        background: "var(--accent-rose-dim)",
                                        color: "var(--accent-rose)",
                                        border: "1px solid rgba(244, 114, 182, 0.2)",
                                    }}
                                >
                                    {error}
                                </motion.p>
                            )}

                            {/* Submit */}
                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={handleRegister}
                                    disabled={saving}
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Creating account...
                                        </>
                                    ) : "Create Account →"}
                                </button>

                                <button
                                    onClick={handleSkip}
                                    disabled={saving}
                                    className="w-full flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-xl transition-all hover:bg-white/5"
                                    style={{
                                        color: "var(--text-secondary)",
                                        border: "1px solid var(--glass-border)",
                                        background: "transparent"
                                    }}
                                >
                                    Skip & Continue Anonymously
                                </button>
                            </div>
                        </div>

                        <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
                            Your data is only used for impact reporting. We never share it with third parties.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
