// Demo internship listings in Accra

export interface Internship {
  id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  type: string;
  description: string;
  requirements: string[];
  sector: string;
}

export const ACCRA_INTERNSHIPS: Internship[] = [
  {
    id: "1",
    company: "MEST Africa",
    role: "Marketing & Growth Intern",
    location: "East Legon, Accra",
    duration: "3–6 months",
    type: "Paid",
    description: "Support marketing campaigns, content creation, and community growth for Africa's premier tech incubator.",
    requirements: ["Strong writing skills", "Social media savvy", "Interest in startups"],
    sector: "Marketing",
  },
  {
    id: "2",
    company: "Ecobank Ghana",
    role: "Investment Banking Analyst Intern",
    location: "Ridge, Accra",
    duration: "3 months",
    type: "Paid",
    description: "Assist with financial modeling, market research, and client presentations for corporate finance deals.",
    requirements: ["Finance/Business background", "Excel proficiency", "Analytical mindset"],
    sector: "Finance",
  },
  {
    id: "3",
    company: "Alliance for a Green Revolution in Africa (AGRA)",
    role: "Communications & Content Intern",
    location: "Airport Residential, Accra",
    duration: "4–6 months",
    type: "Stipend",
    description: "Create content for agriculture and food security initiatives across Africa.",
    requirements: ["Writing/communications background", "Interest in development"],
    sector: "Content",
  },
  {
    id: "4",
    company: "Sankofa Labs",
    role: "Software Development Intern",
    location: "Osu, Accra",
    duration: "3 months",
    type: "Paid",
    description: "Build web and mobile products with a Ghanaian tech startup.",
    requirements: ["Programming experience", "HTML/CSS/JS or mobile"],
    sector: "Tech",
  },
  {
    id: "5",
    company: "Glitz Africa",
    role: "Editorial & Content Creation Intern",
    location: "Labone, Accra",
    duration: "3 months",
    type: "Stipend",
    description: "Write articles, manage social media, and support editorial operations for a leading lifestyle magazine.",
    requirements: ["Strong writing", "Fashion/lifestyle interest", "Social media"],
    sector: "Content",
  },
  {
    id: "6",
    company: "Dalex Finance",
    role: "Marketing & Digital Media Intern",
    location: "East Legon, Accra",
    duration: "3 months",
    type: "Paid",
    description: "Support digital marketing, brand campaigns, and customer engagement for a leading finance company.",
    requirements: ["Marketing interest", "Creative mindset", "Basic design skills"],
    sector: "Marketing",
  },
  {
    id: "7",
    company: "Seedstars",
    role: "Startup Ecosystem & Events Intern",
    location: "Remote / Accra",
    duration: "3–6 months",
    type: "Stipend",
    description: "Help organize events, support portfolio startups, and grow the Ghana startup ecosystem.",
    requirements: ["Event coordination", "Startup interest", "Organized"],
    sector: "Business",
  },
  {
    id: "8",
    company: "Impact Hub Accra",
    role: "Community & Program Intern",
    location: "Labone, Accra",
    duration: "3 months",
    type: "Stipend",
    description: "Support programs for social entrepreneurs and community events at a leading innovation space.",
    requirements: ["Community engagement", "Interest in social impact"],
    sector: "Impact",
  },
];
