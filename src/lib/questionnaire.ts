export interface Question {
  id: string;
  section: string;
  label: string;
  placeholder: string;
  type: "textarea" | "text" | "multiselect";
  options?: string[];
  optional?: boolean; // if true, user can skip with "No experience yet"
}

export const QUESTIONNAIRE: Question[] = [
  {
    id: "past_work",
    section: "experience",
    label: "What is your past work experience?",
    placeholder: "Internships, jobs, volunteer work, leadership roles, or significant projects. What did you do and what did you learn?",
    type: "textarea",
    optional: true,
  },
  {
    id: "skills_strengths",
    section: "experience",
    label: "What are your strongest skills and what do you enjoy doing?",
    placeholder: "Technical skills, soft skills, activities that energize you. Be specific about what you're good at and what you find fulfilling.",
    type: "textarea",
  },
  {
    id: "future_vision",
    section: "aspiration",
    label: "Where do you want to be in 5–10 years?",
    placeholder: "Industry, type of role, impact you want to make, or lifestyle you're building toward.",
    type: "textarea",
  },
  {
    id: "industries_interests",
    section: "aspiration",
    label: "Which industries or fields interest you most?",
    placeholder: "e.g. finance, tech, healthcare, marketing, creative, consulting, nonprofit, education...",
    type: "textarea",
  },
  {
    id: "ideal_day",
    section: "aspiration",
    label: "Describe your ideal work environment and daily rhythm.",
    placeholder: "Team vs. solo, fast-paced vs. steady, office vs. remote, creative vs. analytical, etc.",
    type: "textarea",
  },
];

export const SECTION_LABELS: Record<string, string> = {
  experience: "Your experience",
  aspiration: "Your aspirations",
};
