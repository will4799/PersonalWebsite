import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur border-b border-ink/20">
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
        </ul>
      </nav>
    </header>
  );
}
