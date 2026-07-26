"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".contact-left",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-32"
      style={{ background: "#f5f7fb" }}
    >
      {/* Ambient */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(15,85,222,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 3rem" }}>
        <div ref={titleRef} className="mb-16 text-center">
          <p
            className="text-sm font-medium mb-2 tracking-widest uppercase"
            style={{ color: "var(--accent-blue)", fontFamily: "var(--font-mono)" }}
          >
            05. Contact
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span style={{ color: "#17263a" }}>Let&apos;s{" "}</span>
            <span style={{ color: "var(--accent-blue)" }}>Collaborate</span>
          </h2>
          <p
            className="max-w-lg mx-auto"
            style={{ color: "#42556d", textAlign: "center", marginBottom: "2.5rem" }}
          >
          </p>
        </div>

        <div className="contact-left" style={{ maxWidth: "760px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "18px", padding: "0.25rem" }}>
            {[
              {
                icon: "✉",
                label: "Email",
                href: "mailto:tamoghnekkanti@gmail.com",
                color: "#111827",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                ),
                label: "GitHub",
                href: "https://github.com/Tamogh123",
                color: "#111827",
              },
              {
                icon: "in",
                label: "LinkedIn",
                href: "https://linkedin.com/in/tamogh-nekkanti-253954225",
                color: "#111827",
              },
              {
                icon: "☎",
                label: "Phone",
                href: "tel:+918790133749",
                color: "#111827",
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                title={item.label}
                className="rounded-xl transition-all duration-300 mech-panel"
                style={{
                  border: `1px solid ${item.color}15`,
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.65rem",
                  width: "100%",
                  minHeight: "138px",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: item.color,
                  background: "#ffffff",
                  boxShadow: "0 8px 22px rgba(20,34,52,0.08)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${item.color}50`;
                  (e.currentTarget as HTMLElement).style.background = "#f4f8ff";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${item.color}30`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${item.color}15`;
                  (e.currentTarget as HTMLElement).style.background = "#ffffff";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 22px rgba(20,34,52,0.08)";
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    background: `${item.color}10`,
                    color: item.color,
                    fontSize: item.label === "GitHub" ? "1.1rem" : "1.5rem",
                    lineHeight: 1,
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#51627a",
                  }}
                >
                  {item.label}
                </span>
              </a>
            ))}
          </div>
      </div>
    </section>
  );
}
