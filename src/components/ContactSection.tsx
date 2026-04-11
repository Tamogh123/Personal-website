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
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Ambient */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 3rem" }}>
        <div ref={titleRef} className="mb-16 text-center">
          <p
            className="text-sm font-medium mb-2 tracking-widest uppercase"
            style={{ color: "var(--accent-blue)", fontFamily: "var(--font-geist-mono)" }}
          >
            05. Contact
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span style={{ color: "var(--text-primary)" }}>Let&apos;s{" "}</span>
            <span className="gradient-text">Collaborate</span>
          </h2>
          <p
            className="max-w-lg mx-auto"
            style={{ color: "var(--text-secondary)", textAlign: "center", marginBottom: "2.5rem" }}
          >
          </p>
        </div>

        <div className="contact-left" style={{ maxWidth: "480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              {
                icon: "✉",
                label: "Email",
                href: "mailto:tamoghnekkanti@gmail.com",
                color: "var(--accent-blue)",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                ),
                label: "GitHub",
                href: "https://github.com/Tamogh123",
                color: "var(--accent-purple)",
              },
              {
                icon: "in",
                label: "LinkedIn",
                href: "https://linkedin.com/in/tamogh-nekkanti-253954225",
                color: "var(--accent-green)",
              },
              {
                icon: "☎",
                label: "Phone",
                href: "tel:+918790133749",
                color: "var(--accent-blue)",
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                title={item.label}
                className="glass rounded-xl transition-all duration-300"
                style={{
                  border: `1px solid ${item.color}15`,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  aspectRatio: "1",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: item.color,
                  background: `${item.color}08`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${item.color}50`;
                  (e.currentTarget as HTMLElement).style.background = `${item.color}18`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${item.color}30`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${item.color}15`;
                  (e.currentTarget as HTMLElement).style.background = `${item.color}08`;
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.icon}
                </span>
              </a>
            ))}
          </div>
      </div>
    </section>
  );
}
