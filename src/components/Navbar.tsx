"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    );

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-500">
      <div
        className="max-w-7xl mx-auto"
        style={{
          padding: "0.25rem 1rem",
          background: scrolled ? "#ffffff" : "transparent",
          border: scrolled ? "1px solid rgba(15,32,58,0.14)" : "1px solid transparent",
          boxShadow: scrolled ? "0 10px 28px rgba(20,34,52,0.12)" : "none",
          backdropFilter: scrolled ? "blur(8px)" : "none",
        }}
      >
      <div className="flex items-center justify-between w-full" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
        {/* Gundam command badge */}
          <div className="flex items-center gap-3" style={{ cursor: "pointer" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(16, 42, 80, 0.22)",
              background: "linear-gradient(180deg, #ffffff, #f2f7ff)",
              padding: "0.5rem 0.7rem",
              boxShadow: "0 6px 18px rgba(22, 44, 78, 0.12)",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                display: "inline-block",
                borderRadius: 2,
                background: "#0f55de",
                boxShadow: "0 0 10px rgba(15, 85, 222, 0.35)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  border: "2px solid #1c3f75",
                  boxShadow: "inset 0 0 0 2px #ffffff",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: "#1c4db3",
                  display: "inline-block",
                }}
              />
              <span style={{ width: 12, height: 2, background: "#2a4f87", display: "inline-block" }} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.08em",
                color: "#315078",
                textTransform: "uppercase",
              }}
            >
              VU3TKI
            </span>
          </div>
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <li key={i}>
              <a
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm font-medium tracking-wider uppercase transition-colors duration-300"
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--accent-blue)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--text-secondary)")
                }
              >
                <span style={{ color: "var(--accent-blue)" }}>{"0" + (i + 1) + ". "}</span>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/Tamogh_Nekkanti_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
              onMouseEnter={(e) => {
                const card = e.currentTarget.querySelector(".resume-command") as HTMLElement;
                if (card) {
                  card.style.borderColor = "rgba(20,80,201,0.4)";
                  card.style.boxShadow = "0 0 16px rgba(20,80,201,0.18)";
                }
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget.querySelector(".resume-command") as HTMLElement;
                if (card) {
                  card.style.borderColor = "rgba(20,80,201,0.2)";
                  card.style.boxShadow = "0 0 10px rgba(20,80,201,0.1)";
                }
              }}
            >
              <div
                className="resume-command"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  border: "1px solid rgba(20,80,201,0.2)",
                  background: "linear-gradient(180deg, #ffffff, #f3f7ff)",
                  boxShadow: "0 0 10px rgba(20,80,201,0.1)",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#34527a" }}>CMD</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#1450c9", fontWeight: 700 }}>DEPLOY</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "#2d3f59" }}>RESUME.PDF</span>
              </div>
            </a>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-6 h-0.5 transition-all duration-300"
              style={{
                background: "var(--accent-blue)",
                transform:
                  menuOpen && i === 0
                    ? "rotate(45deg) translate(4px, 4px)"
                    : menuOpen && i === 1
                    ? "scaleX(0)"
                    : menuOpen && i === 2
                    ? "rotate(-45deg) translate(4px, -4px)"
                    : "none",
              }}
            />
          ))}
        </button>
      </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden transition-all duration-500 overflow-hidden"
        style={{ maxHeight: menuOpen ? "300px" : "0px" }}
      >
        <ul className="flex flex-col gap-4 pt-6 pb-4 px-4">
          {navLinks.map((link, i) => (
            <li key={i}>
              <a
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm font-medium tracking-wider uppercase"
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span style={{ color: "var(--accent-blue)" }}>{"0" + (i + 1) + ". "}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
