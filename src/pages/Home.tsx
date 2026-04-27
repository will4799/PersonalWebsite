import { Link } from "react-router-dom";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function Home() {
  const featured = projects.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="min-h-[calc(100vh-3.5rem)] flex items-center">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="text-accent text-sm font-medium mb-4 tracking-widest uppercase">
            Hi, It&apos;s
          </p>
          <h1 className="text-5xl sm:text-7xl font-bold text-ink leading-tight">
            WILL_HERE
          </h1>
          <p className="mt-4 text-2xl sm:text-3xl font-light text-ink-light">
            Software Engineer & Hobbyist Alcoholic
          </p>
          <p className="mt-6 max-w-xl text-ink-light leading-relaxed">
            This is a place to store and display the various projects I&apos;ve worked on.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/projects"
              className="px-6 py-3 bg-accent hover:bg-accent-light text-white rounded-lg font-medium transition-colors"
            >
              View Projects
            </Link>
            <a
              href="#contact"
              className="px-6 py-3 border border-accent hover:border-accent-light text-accent hover:text-accent-light rounded-lg font-medium transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* About
      <section id="about" className="py-24 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-8">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 text-gray-400 leading-relaxed">
            <p>
              I&apos;m a developer who loves turning ideas into reality through code. I specialize
              in building full-stack web applications with modern technologies like React,
              TypeScript, and Node.js.
            </p>
            <p>
              When I&apos;m not coding, I enjoy contributing to open source, learning new
              technologies, and sharing what I know with the community.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {["TypeScript", "React", "Node.js", "Tailwind CSS", "PostgreSQL"].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded-md border border-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section> */}

      {/* Featured Projects */}
      <section className="py-24 border-t border-ink">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-ink">Featured Projects</h2>
            <Link to="/projects" className="text-accent hover:text-accent-light text-sm transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 border-t border-ink">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-ink mb-4">Get In Touch</h2>
          <p className="text-ink-light max-w-md mx-auto mb-8">
            Flick me an email below or find me on GitHub and LinkedIn.
          </p>
          <a
            href="mailto:wherewini4799@gmail.com"
            className="inline-block px-8 py-3 bg-accent hover:bg-accent-light text-white rounded-lg font-medium transition-colors"
          >
            Say Hello
          </a>
          <div className="mt-10 flex justify-center gap-6 text-ink-light text-sm">
            <a href="https://github.com/will4799" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              GitHub
            </a>
            <a href="https://linkedin.com/in/william-herewini-59a7ba1b1/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
