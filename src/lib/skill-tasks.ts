// Skill verification demo tasks for each internship sector

export interface SkillTask {
    id: string;
    sector: string;
    question: string;
    type: "multiple-choice";
    options: string[];
    correctAnswer: number; // index of correct option
    explanation: string;
}

export const SKILL_TASKS: SkillTask[] = [
    // Tech
    {
        id: "tech-1",
        sector: "Tech",
        question: "What does the acronym API stand for?",
        type: "multiple-choice",
        options: [
            "Application Programming Interface",
            "Automated Process Integration",
            "Advanced Program Instruction",
            "Application Process Iteration",
        ],
        correctAnswer: 0,
        explanation: "API stands for Application Programming Interface — it allows different software systems to communicate with each other.",
    },
    {
        id: "tech-2",
        sector: "Tech",
        question: "Which of the following is NOT a programming language?",
        type: "multiple-choice",
        options: ["Python", "HTML", "Java", "Photoshop"],
        correctAnswer: 3,
        explanation: "Photoshop is an image editing software by Adobe, not a programming language. HTML is a markup language, while Python and Java are programming languages.",
    },
    // Finance
    {
        id: "finance-1",
        sector: "Finance",
        question: "What does DCF stand for in financial modeling?",
        type: "multiple-choice",
        options: [
            "Direct Cash Flow",
            "Discounted Cash Flow",
            "Deferred Capital Funding",
            "Digital Currency Framework",
        ],
        correctAnswer: 1,
        explanation: "DCF stands for Discounted Cash Flow — a valuation method that estimates the present value of an investment based on expected future cash flows.",
    },
    {
        id: "finance-2",
        sector: "Finance",
        question: "If a company's revenue is $500K and expenses are $350K, what is the profit margin?",
        type: "multiple-choice",
        options: ["25%", "30%", "35%", "40%"],
        correctAnswer: 1,
        explanation: "Profit margin = (Revenue - Expenses) / Revenue = ($500K - $350K) / $500K = $150K / $500K = 30%.",
    },
    // Marketing
    {
        id: "marketing-1",
        sector: "Marketing",
        question: "What does CTR stand for in digital marketing?",
        type: "multiple-choice",
        options: [
            "Cost To Revenue",
            "Click-Through Rate",
            "Content Tracking Report",
            "Customer Target Reach",
        ],
        correctAnswer: 1,
        explanation: "CTR stands for Click-Through Rate — the percentage of people who click on a link or ad after seeing it.",
    },
    {
        id: "marketing-2",
        sector: "Marketing",
        question: "Which metric best measures brand awareness on social media?",
        type: "multiple-choice",
        options: ["Conversion rate", "Impressions and reach", "Cost per acquisition", "Return on ad spend"],
        correctAnswer: 1,
        explanation: "Impressions and reach measure how many people see your content, making them the best indicators of brand awareness.",
    },
    // Content
    {
        id: "content-1",
        sector: "Content",
        question: "What is the primary purpose of a content editorial calendar?",
        type: "multiple-choice",
        options: [
            "Track website analytics",
            "Plan and schedule content publication",
            "Manage employee salaries",
            "Design website layouts",
        ],
        correctAnswer: 1,
        explanation: "An editorial calendar helps plan, organize, and schedule content across channels to ensure consistent publishing.",
    },
    {
        id: "content-2",
        sector: "Content",
        question: "Which of these is a best practice for writing engaging headlines?",
        type: "multiple-choice",
        options: [
            "Use as many words as possible",
            "Avoid using numbers",
            "Create curiosity or promise value",
            "Always write in ALL CAPS",
        ],
        correctAnswer: 2,
        explanation: "Effective headlines create curiosity or promise value to the reader, encouraging them to click and read more.",
    },
    // Business
    {
        id: "business-1",
        sector: "Business",
        question: "What does MVP stand for in the startup context?",
        type: "multiple-choice",
        options: [
            "Most Valuable Player",
            "Minimum Viable Product",
            "Maximum Value Proposition",
            "Market Validation Process",
        ],
        correctAnswer: 1,
        explanation: "MVP stands for Minimum Viable Product — the simplest version of a product that can be released to test a business idea with real users.",
    },
    // Impact
    {
        id: "impact-1",
        sector: "Impact",
        question: "What is a 'theory of change' in the context of social impact?",
        type: "multiple-choice",
        options: [
            "A financial model for nonprofits",
            "A map of how activities lead to desired social outcomes",
            "A marketing strategy for NGOs",
            "A legal framework for charitable organizations",
        ],
        correctAnswer: 1,
        explanation: "A theory of change maps out the causal pathway from activities and outputs to the intended social impact and outcomes.",
    },
];

export function getTasksForSector(sector: string): SkillTask[] {
    return SKILL_TASKS.filter((t) => t.sector === sector);
}

export function getVerifiedSectors(): Set<string> {
    if (typeof window === "undefined") return new Set();
    try {
        const raw = localStorage.getItem("pathfinder_verified_sectors");
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
        return new Set();
    }
}

export function markSectorVerified(sector: string): void {
    if (typeof window === "undefined") return;
    const existing = getVerifiedSectors();
    existing.add(sector);
    localStorage.setItem("pathfinder_verified_sectors", JSON.stringify(Array.from(existing)));
}
