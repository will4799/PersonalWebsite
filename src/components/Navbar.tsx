import { Link } from "react-router-dom";

type NavbarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const isDarkMode = theme === "dark";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-surface/80 border-b border-ink/20 transition-colors duration-300">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" onClick={() => window.scrollTo(0, 0)} className="group font-bold text-lg tracking-tight hover:text-accent transition-colors">
          will<span className="inline-block align-bottom overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-[2em] transition-all duration-300 ease-in-out">iam</span>_here<span className="inline-block align-bottom overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-[2.5em] transition-all duration-300 ease-in-out">wini</span>
        </Link>
        <ul className="flex items-center gap-6 text-sm text-ink-light">
          {/* <li>
            <a href="/#about" className="hover:text-accent transition-colors">
              About
            </a>
          </li> */}
          <li>
            <Link to="/projects" className="hover:text-accent transition-colors">
              Projects
            </Link>
          </li>
          <li>
            <a href="/#contact" className="hover:text-accent transition-colors">
              Contact
            </a>
          </li>
          <li>
            <button
              type="button"
              onClick={onToggleTheme}
              role="switch"
              aria-checked={isDarkMode}
              aria-label="Toggle dark mode"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex items-center gap-2 text-xs font-medium text-ink hover:text-accent transition-colors"
            >
              <span
                aria-hidden="true"
                className={`relative inline-flex h-5 w-9 rounded-full border border-ink/30 bg-tile transition-colors duration-300 ${isDarkMode ? "bg-accent/50" : "bg-tile"}`}
              >
                <span
                  className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-ink transition-all duration-300 ${isDarkMode ? "left-[18px]" : "left-0.5"}`}
                />
              </span>
              <span aria-hidden="true" className="min-w-9 text-left">
                {isDarkMode ? "Dark" : "Light"}
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
