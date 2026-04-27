import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Wait for page to render before scrolling to the element
    const id = hash.slice(1);
    const attempt = (retries: number) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else if (retries > 0) {
        setTimeout(() => attempt(retries - 1), 50);
      }
    };
    attempt(5);
  }, [pathname, hash]);

  return null;
}
