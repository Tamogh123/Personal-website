"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import dynamic from "next/dynamic";

const NeuralNetCanvas = dynamic(() => import("./NeuralNetCanvas"), {
  ssr: false,
});

const ROLES = [
  "Machine Learning Engineer",
  "Rust Systems Developer",
  "Open Source Contributor",
  "ML Platform Architect",
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const roleIdx = useRef(0);

  // Text scramble effect
  const scramble = (el: HTMLElement, finalText: string, duration = 800) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*";
    const steps = 14;
    let step = 0;
    const interval = setInterval(() => {
      el.textContent = finalText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < (step / steps) * finalText.length) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      step++;
      if (step > steps) {
        clearInterval(interval);
        el.textContent = finalText;
      }
    }, duration / steps);
  };

  // Role cycling
  useEffect(() => {
    if (!roleRef.current) return;
    const cycle = () => {
      const el = roleRef.current;
      if (!el) return;
      roleIdx.current = (roleIdx.current + 1) % ROLES.length;
      gsap.to(el, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
          el.textContent = ROLES[roleIdx.current];
          scramble(el, ROLES[roleIdx.current]);
          gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
        },
      });
    };
    const id = setInterval(cycle, 2800);
    return () => clearInterval(id);
  }, []);

  // Entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 1 });

    tl.fromTo(
      ".hero-tag",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
    )
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

    // Scramble heading
    if (headingRef.current) {
      setTimeout(() => {
        const el = headingRef.current;
        if (el) scramble(el, "Tamogh", 1200);
      }, 1000);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Neural net — right half */}
      <div
        className="absolute top-0 right-0 h-full"
        style={{ width: "55%", zIndex: 0 }}
      >
        <NeuralNetCanvas />
        {/* Fade the left edge so it doesn't bleed into text */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, var(--bg-primary) 0%, rgba(2,4,8,0.6) 30%, transparent 70%)",
          }}
        />
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          zIndex: 1,
        }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(2,4,8,0.9))",
          zIndex: 1,
        }}
      />

      {/* Content — left side */}
      <div
        className="relative z-10 w-full py-32"
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "8rem 3rem" }}
      >
        <div className="max-w-xl">
          <div
            className="hero-tag inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase"
            style={{
              background: "rgba(0, 212, 255, 0.08)",
              border: "1px solid rgba(0, 212, 255, 0.2)",
              color: "var(--accent-blue)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: "var(--accent-green)",
                boxShadow: "0 0 8px var(--accent-green)",
                animation: "pulse-ring 1.5s ease-out infinite",
              }}
            />
            Machine Learning Engineer @ BlackRock
          </div>

          <h1
            ref={headingRef}
            className="text-7xl md:text-9xl font-black mb-4 leading-none tracking-tight"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            <span className="glitch-text gradient-text" data-text="Tamogh">
              Tamogh
            </span>
          </h1>

          <div ref={subtitleRef} className="mb-8" style={{ marginTop: "2rem" }}>
            <p
              className="text-xl md:text-2xl font-light mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              I&apos;m a{" "}
              <span
                ref={roleRef}
                className="font-semibold"
                style={{ color: "var(--accent-blue)", display: "inline-block", minWidth: "320px" }}
              >
                {ROLES[0]}
              </span>
            </p>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Building unified ML platforms at{" "}
              <span style={{ color: "var(--accent-purple)" }}>BlackRock</span>
              {" — from open-source research to multi-cloud production inference."}
            </p>
          </div>

          <div ref={ctaRef} />
        </div>
      </div>

    </section>
  );
}
