"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import dynamic from "next/dynamic";

const NavBlobLogo = dynamic(() => import("./NavBlobLogo"), { ssr: false });

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
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(2, 4, 8, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(0, 212, 255, 0.1)"
          : "1px solid transparent",
      }}
    >
      <div className="flex items-center justify-between w-full" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
        {/* Terminal logo */}
        <div className="flex items-center gap-3" style={{ cursor: "pointer" }}>
          <NavBlobLogo size={40} />
          {/* Mini terminal card */}
          <div
            style={{
              background: "rgba(5, 10, 18, 0.92)",
              border: "1px solid rgba(0, 212, 255, 0.18)",
              borderRadius: "8px",
              padding: "5px 12px 5px 10px",
              display: "flex",
              alignItems: "center",
              gap: "0",
              boxShadow: "0 0 12px rgba(0,212,255,0.08)",
            }}
          >
            {/* Traffic-light dots */}
            <div style={{ display: "flex", gap: "5px", marginRight: "10px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f56", display: "block" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e", display: "block" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#27c93f", display: "block" }} />
            </div>
            {/* Prompt */}
            <span
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "13px",
                color: "rgba(100,160,200,0.55)",
                marginRight: "6px",
              }}
            >
              ~/
            </span>
            <span
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "13px",
                color: "var(--accent-blue)",
                marginRight: "5px",
                fontWeight: 600,
              }}
            >
            </span>
            <span
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "13px",
                fontWeight: 700,
                background: "linear-gradient(90deg, var(--accent-blue), var(--accent-purple))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              tamogh
            </span>
            {/* Blinking cursor */}
            <span
              className="cursor-blink"
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "13px",
                color: "var(--accent-green)",
                marginLeft: "2px",
              }}
            >
              ▌
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
                  fontFamily: "var(--font-geist-mono)",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--accent-blue)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--text-secondary)")
                }
              >
                <span style={{ color: "var(--accent-purple)" }}>{"0" + (i + 1) + ". "}</span>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/Tamogh_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
              onMouseEnter={(e) => {
                const card = e.currentTarget.querySelector(".resume-terminal") as HTMLElement;
                if (card) {
                  card.style.borderColor = "rgba(0,212,255,0.45)";
                  card.style.boxShadow = "0 0 16px rgba(0,212,255,0.18)";
                }
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget.querySelector(".resume-terminal") as HTMLElement;
                if (card) {
                  card.style.borderColor = "rgba(0,212,255,0.18)";
                  card.style.boxShadow = "0 0 12px rgba(0,212,255,0.08)";
                }
              }}
            >
              {/* Mini terminal card — resume */}
              <div
                className="resume-terminal"
                style={{
                  background: "rgba(5, 10, 18, 0.92)",
                  border: "1px solid rgba(0, 212, 255, 0.18)",
                  borderRadius: "8px",
                  padding: "5px 12px 5px 10px",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 0 12px rgba(0,212,255,0.08)",
                  transition: "border-color 0.25s, box-shadow 0.25s",
                  cursor: "pointer",
                }}
              >
                {/* Traffic-light dots */}
                <div style={{ display: "flex", gap: "5px", marginRight: "10px" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f56", display: "block" }} />
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e", display: "block" }} />
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#27c93f", display: "block" }} />
                </div>
                {/* Prompt */}
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "13px", color: "rgba(100,160,200,0.55)", marginRight: "6px" }}>
                  ~/
                </span>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "13px", color: "var(--accent-blue)", marginRight: "5px", fontWeight: 600 }}>
                  open
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "13px",
                    fontWeight: 700,
                    background: "linear-gradient(90deg, var(--accent-blue), var(--accent-purple))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  resume.pdf
                </span>
                {/* Blinking cursor */}
                <span
                  className="cursor-blink"
                  style={{ fontFamily: "var(--font-geist-mono)", fontSize: "13px", color: "var(--accent-green)", marginLeft: "2px" }}
                >
                  ▌
                </span>
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
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                <span style={{ color: "var(--accent-purple)" }}>{"0" + (i + 1) + ". "}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
