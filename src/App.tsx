import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ScrollToHash from "@/components/ScrollToHash";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <div className="min-h-screen bg-surface text-ink">
        <Navbar />
        <main className="pt-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
