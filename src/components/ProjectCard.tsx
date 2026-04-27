import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-surface border border-ink rounded-xl p-6 flex flex-col gap-4 hover:border-accent-light transition-colors">
      <div>
        <h3 className="text-ink font-semibold text-lg">{project.title}</h3>
        <p className="text-ink-light text-sm mt-1 leading-relaxed">{project.description}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded-md bg-accent-light/50 text-ink border border-ink/20"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-3 text-sm">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-light hover:text-accent transition-colors"
          >
            GitHub →
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-light hover:text-accent transition-colors"
          >
            Live →
          </a>
        )}
      </div>
    </div>
  );
}
