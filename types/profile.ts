export type Entry = {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  description: string;
  logo?: string;
};

export type LogoTarget = { type: "experience" | "education"; id: string };
