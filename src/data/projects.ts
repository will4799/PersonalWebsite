export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Personal Website",
    description: "This very site — a developer portfolio built with Vite, React, and Tailwind CSS.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    repoUrl: "https://github.com/",
  },
  {
    id: 2,
    title: "Particle Playground (p5.js)",
    description: "A lightweight interactive particle simulation built with vanilla JavaScript and p5.js.",
    tags: ["JavaScript", "p5.js", "Creative Coding"],
    liveUrl: "/projects/p5-particles/index.html",
  },
  {
    id: 3,
    title: "Name Randomiser (p5.js)",
    description: "An interactive name randomiser built with vanilla JavaScript and p5.js.",
    tags: ["JavaScript", "p5.js", "Creative Coding"],
    liveUrl: "/projects/name-randomiser/index.html",
  },
];
