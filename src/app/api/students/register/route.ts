import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "students.json");

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    age: number;
    registeredAt: string;
    isAnonymous?: boolean;
}

async function readStudents(): Promise<Student[]> {
    try {
        const raw = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

async function writeStudents(students: Student[]) {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, city, age, skip } = body;

        const students = await readStudents();

        if (skip) {
            const anonStudent: Student = {
                id: `anon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                firstName: "Anonymous",
                lastName: "User",
                email: `anonymous_${Date.now()}@example.com`,
                city: "Unknown",
                age: 0,
                registeredAt: new Date().toISOString(),
                isAnonymous: true,
            };
            students.push(anonStudent);
            await writeStudents(students);
            return NextResponse.json({ success: true, student: anonStudent });
        }

        // Validation
        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !city?.trim() || !age) {
            return NextResponse.json(
                { success: false, error: "All fields are required (firstName, lastName, email, city, age)" },
                { status: 400 }
            );
        }

        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
            return NextResponse.json(
                { success: false, error: "Please enter a valid age (13-120)" },
                { status: 400 }
            );
        }

        // Check for duplicate email
        if (students.some((s) => s.email.toLowerCase() === email.trim().toLowerCase())) {
            return NextResponse.json(
                { success: false, error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        const newStudent: Student = {
            id: `stu_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            city: city.trim(),
            age: ageNum,
            registeredAt: new Date().toISOString(),
        };

        students.push(newStudent);
        await writeStudents(students);

        return NextResponse.json({ success: true, student: newStudent });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { success: false, error: "Registration failed. Please try again." },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const students = await readStudents();
        return NextResponse.json({ students, total: students.length });
    } catch {
        return NextResponse.json({ students: [], total: 0 });
    }
}
