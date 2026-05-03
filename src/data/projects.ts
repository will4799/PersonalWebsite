export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  liveUrlInternal?: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Personal Website",
    description: "This very site — a developer portfolio built with Vite, React, and Tailwind CSS.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    repoUrl: "https://github.com/will4799/PersonalWebsite",
  },
  {
    id: 2,
    title: "Particle Playground (p5.js)",
    description: "A lightweight interactive particle simulation built with vanilla JavaScript and p5.js.",
    tags: ["JavaScript", "p5.js"],
    liveUrl: "/projects/p5-particles/index.html",
  },
  {
    id: 3,
    title: "Name Randomiser (p5.js)",
    description: "An interactive name randomiser built with vanilla JavaScript and p5.js.",
    tags: ["JavaScript", "p5.js"],
    liveUrl: "/projects/name-randomiser/index.html",
  },
  {
    id: 4,
    title: "Backyard GS (Gaussian Splatting)",
    description: "A 3D Gaussian Splat experience.",
    tags: ["Gaussian Splatting", "PlayCanvas", "SuperSplat"],
    liveUrl: "/projects/backyard-gs-view",
    liveUrlInternal: true,
  },
];
