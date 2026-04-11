"use client";

export default function Footer() {
  return (
    <footer
      className="py-8 px-6 text-center"
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid rgba(0,212,255,0.08)",
      }}
    >
      <p
        className="text-sm"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-geist-mono)" }}
      >
        <span style={{ color: "var(--accent-blue)" }}>{"<"}</span>
        <span className="gradient-text">tamogh</span>
        <span style={{ color: "var(--accent-blue)" }}>{" />"}</span>
        {" "}— Designed & Built by Tamogh · {new Date().getFullYear()}
      </p>
      <p
        className="text-xs mt-2"
        style={{ color: "var(--text-secondary)", opacity: 0.5, fontFamily: "var(--font-geist-mono)" }}
      >
        Built with Next.js · Three.js · GSAP · Lenis · Tailwind
      </p>
    </footer>
  );
}
