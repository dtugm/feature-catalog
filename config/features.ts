import { LucideIcon } from "lucide-react";

export interface Feature {
  id: string;
  slug: string;
  title: {
    en: string;
    id: string;
  };
  description: {
    en: string;
    id: string;
  };
  iconName: string;
  tags: string[];
}

export const features: Feature[] = [
  {
    id: "carbon-stock",
    slug: "carbon-stock",
    title: {
      en: "Carbon Stock Analysis",
      id: "Analisis Cadangan Karbon",
    },
    description: {
      en: "Monitor and analyze carbon stock distribution across different zones.",
      id: "Pantau dan analisis distribusi cadangan karbon di berbagai zona.",
    },
    iconName: "Leaf",
    tags: ["Environment", "Analysis", "Maps"],
  },
];
