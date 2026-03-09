import { NextRequest, NextResponse } from "next/server";
import { getCareerById } from "@/lib/careers";

interface CVInput {
    fullName: string;
    targetCareerId: string;
    skills: string;
    experience: { company: string; role: string; duration: string; description: string }[];
    education: { school: string; degree: string; year: string }[];
}

function generateTemplateSummary(input: CVInput): string {
    const career = input.targetCareerId ? getCareerById(input.targetCareerId) : null;
    const name = input.fullName || "Professional";
    const careerTitle = career?.title || "a fulfilling career";

    const parts: string[] = [];

    // Intro
    const hasExperience = input.experience.some((e) => e.company || e.role);
    const hasEducation = input.education.some((e) => e.school || e.degree);

    if (hasExperience) {
        const roles = input.experience.filter((e) => e.role).map((e) => e.role);
        if (roles.length > 0) {
            parts.push(
                `Motivated professional with experience as ${roles.slice(0, 2).join(" and ")}, seeking to leverage skills toward a career as a ${careerTitle}.`
            );
        } else {
            parts.push(
                `Driven and adaptable professional seeking to build a career as a ${careerTitle}.`
            );
        }
    } else {
        parts.push(
            `Ambitious and eager individual seeking to launch a career as a ${careerTitle}.`
        );
    }

    // Skills mention
    const skillList = input.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (skillList.length > 0) {
        parts.push(
            `Brings strong skills in ${skillList.slice(0, 4).join(", ")}.`
        );
    }

    // Education mention
    if (hasEducation) {
        const edu = input.education.find((e) => e.degree);
        if (edu?.degree) {
            parts.push(
                `${edu.degree}${edu.school ? ` from ${edu.school}` : ""}.`
            );
        }
    }

    // Career-specific additions
    if (career) {
        const growthSkills = career.growthAreas.map((g) => g.skill).slice(0, 2);
        if (growthSkills.length > 0) {
            parts.push(
                `Passionate about developing expertise in ${growthSkills.join(" and ")}.`
            );
        }
    }

    return parts.join(" ");
}

function generateTemplateSkills(input: CVInput): string {
    const career = input.targetCareerId ? getCareerById(input.targetCareerId) : null;
    const existingSkills = input.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    if (career) {
        const careerSkills = career.growthAreas.map((g) => g.skill);
        const allSkills = Array.from(new Set([...existingSkills, ...careerSkills]));
        return allSkills.join(", ");
    }

    return existingSkills.join(", ");
}

export async function POST(req: NextRequest) {
    try {
        const body: CVInput = await req.json();

        // Try OpenAI first
        if (process.env.OPENAI_API_KEY) {
            try {
                const OpenAI = (await import("openai")).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

                const career = body.targetCareerId ? getCareerById(body.targetCareerId) : null;
                const careerContext = career
                    ? `Target career: ${career.title}. Day in the life: ${career.dayInLife.join(" ")}. Key growth areas: ${career.growthAreas.map((g) => `${g.skill}: ${g.description}`).join("; ")}.`
                    : "";

                const experienceContext = body.experience
                    .filter((e) => e.role || e.company)
                    .map((e) => `${e.role} at ${e.company}: ${e.description}`)
                    .join(". ");

                const educationContext = body.education
                    .filter((e) => e.school || e.degree)
                    .map((e) => `${e.degree} from ${e.school} (${e.year})`)
                    .join(". ");

                const prompt = `Write a professional CV summary (3-4 sentences) for a student/early career professional.
Name: ${body.fullName || "Student"}
${careerContext}
Experience: ${experienceContext || "None yet"}
Education: ${educationContext || "Not specified"}
Current skills: ${body.skills || "Not specified"}

Write in first person implied (no "I"), professional and confident tone. Focus on how their background connects to the target career. Be specific and actionable.`;

                const skillsPrompt = career
                    ? `Given a student targeting a career as a ${career.title}, with current skills: ${body.skills || "none listed"}, suggest a complete comma-separated list of 8-12 relevant skills (mix their existing skills with new relevant ones for this career). Return ONLY the comma-separated list, nothing else.`
                    : null;

                const [summaryRes, skillsRes] = await Promise.all([
                    openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: prompt }],
                        max_tokens: 200,
                        temperature: 0.7,
                    }),
                    skillsPrompt
                        ? openai.chat.completions.create({
                            model: "gpt-4o-mini",
                            messages: [{ role: "user", content: skillsPrompt }],
                            max_tokens: 100,
                            temperature: 0.5,
                        })
                        : null,
                ]);

                return NextResponse.json({
                    summary: summaryRes.choices[0]?.message?.content?.trim() || generateTemplateSummary(body),
                    skills: skillsRes?.choices[0]?.message?.content?.trim() || generateTemplateSkills(body),
                    source: "ai",
                });
            } catch (aiErr) {
                console.error("OpenAI CV generation error:", aiErr);
                // Fall through to template
            }
        }

        // Template fallback
        return NextResponse.json({
            summary: generateTemplateSummary(body),
            skills: generateTemplateSkills(body),
            source: "template",
        });
    } catch (e) {
        console.error("CV generation error:", e);
        return NextResponse.json({ error: "Failed to generate CV content" }, { status: 500 });
    }
}
