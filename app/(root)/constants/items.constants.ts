import { Icons } from "@/components/icons";
import { TablerIcon } from "@tabler/icons-react";

const ICON_MAP: Record<string, TablerIcon> = {
  "HTML": Icons.brandHtml,
  "Javascript": Icons.brandJavascript,
  "Vanilla CSS": Icons.brandCss,
  "Python": Icons.brandPython,
  "React": Icons.brandReact,
  "Next.js": Icons.brandNextJs,
  "Tailwind CSS": Icons.brandTailwind,
  "Typescript": Icons.brandTypescript,
  "Express.js": Icons.brandExpress as unknown as TablerIcon, // This is a custom icon
  "Node.js": Icons.brandNodejs,
  "Mongo DB": Icons.brandMongoDb
};

const NAV_ITEMS = [
  { href: "#about", key: "about" },
  { href: "#projects", key: "projects" },
  { href: "#services", key: "services" },
  { href: "#experiences", key: "experiences" },
  { href: "#certifications", key: "certifications" },
  { href: "#contact", key: "contact" },
];

const JOURNEY_STEPS = [
  {
    id: "step1",
    status: "Completed",
  },
  {
    id: "step2",
    status: "Completed",
  },
  {
    id: "step3",
    status: "Completed",
  },
  {
    id: "step4",
    status: "Active",
  },
  {
    id: "step5",
    status: "Planned",
  },
  {
    id: "step6",
    status: "Planned",
  },
];

const SERVICES = [
  {
    key: "fe",
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    key: "be",
    techStack: ["Node.js", "Express.js", "PostgreSQL", "Supabase", "MongoDB"],
  },
  {
    key: "ml",
    techStack: ["Python", "TensorFlow", "NumPy", "Scikit-learn", "Pandas", "Matplotlib"],
  },
];

export { NAV_ITEMS, ICON_MAP, JOURNEY_STEPS, SERVICES };