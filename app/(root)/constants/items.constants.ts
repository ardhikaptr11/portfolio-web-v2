import { Icons } from "@/components/icons";
import { TablerIcon } from "@tabler/icons-react";

const ICON_MAP: Record<string, TablerIcon> = {
  Axios: Icons.brandAxios as unknown as TablerIcon, // This is a custom icon
  "Express.js": Icons.brandExpress as unknown as TablerIcon,
  Firebase: Icons.brandFirebase,
  HTML: Icons.brandHtml,
  Javascript: Icons.brandJavascript,
  "Mongo DB": Icons.brandMongoDb,
  "Next.js": Icons.brandNextJs,
  "Node.js": Icons.brandNodejs,
  Python: Icons.brandPython,
  React: Icons.brandReact, 
  Supabase: Icons.brandSupabase,
  "Tailwind CSS": Icons.brandTailwind,
  Tanstack: Icons.brandTanstack as unknown as TablerIcon,
  Typescript: Icons.brandTypescript,
  "Vanilla CSS": Icons.brandCss,
  Zod: Icons.brandZod as unknown as TablerIcon,
  Zustand: Icons.brandZustand as unknown as TablerIcon,
};

const NAV_ITEMS = [
  { href: "#about", key: "about" },
  { href: "#projects", key: "projects" },
  { href: "#services", key: "services" },
  { href: "#experience", key: "experience" },
  { href: "#certifications", key: "certifications" },
  { href: "#contact", key: "contact" },
];

const JOURNEY_STEPS = [
  {
    key: "step1",
    status: "Completed",
  },
  {
    key: "step2",
    status: "Completed",
  },
  {
    key: "step3",
    status: "Completed",
  },
  {
    key: "step4",
    status: "Active",
  },
  {
    key: "step5",
    status: "Planned",
  },
  {
    key: "step6",
    status: "Planned",
  },
];

const SERVICES = [
  {
    key: "fe",
    values: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    key: "be",
    values: ["Node.js", "Express.js", "PostgreSQL", "Supabase", "MongoDB"],
  },
  {
    key: "ml",
    values: [
      "Python",
      "TensorFlow",
      "NumPy",
      "Scikit-learn",
      "Pandas",
      "Matplotlib",
    ],
  },
];

const TECH_STACK_OPTIONS = [
  { key: "react", label: "React" },
  { key: "typescript", label: "Typescript" },
  { key: "supabase", label: "Supabase" },
  { key: "tailwind-css", label: "Tailwind CSS" },
  { key: "javascript", label: "Javascript" },
  { key: "python", label: "Python" },
  { key: "firebase", label: "Firebase" },
  { key: "vanilla-css", label: "CSS3" },
];

const PROJECT_STATUS_OPTIONS = [
  { key: "live", value: "live" },
  { key: "under-development", value: "under_development" },
  { key: "archived", value: "archived" },
];

const ROLE_OPTIONS = [
  { key: "fullstack-developer", label: "Fullstack Developer" },
  { key: "frontend-developer", label: "Frontend Developer" },
  { key: "backend-developer", label: "Backend Developer" },
  { key: "project-manager", label: "Project Manager" },
  { key: "ml-engineer", label: "ML Engineer" },
];

const PAGE_SIZE_OPTIONS = ["5", "10", "15"];

const SORT_OPTIONS = [
  {
    key: "title",
    isSub: true,
    options: [
      {
        key: "asc",
        value: "title.asc",
        icon: "sortAZ",
      },
      {
        key: "desc",
        value: "title.desc",
        icon: "sortZA",
      },
    ],
  },
  {
    key: "date",
    isSub: true,
    options: [
      {
        key: "earliest",
        value: "start_date.asc",
        icon: "sort09",
      },
      {
        key: "latest",
        value: "start_date.desc",
        icon: "sort90",
      },
    ],
  },
];

export {
  NAV_ITEMS,
  ICON_MAP,
  JOURNEY_STEPS,
  SERVICES,
  TECH_STACK_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  ROLE_OPTIONS,
  PAGE_SIZE_OPTIONS,
  SORT_OPTIONS,
};
