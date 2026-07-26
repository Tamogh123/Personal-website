
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import dynamic from "next/dynamic";

const GundamInnerFrameCanvas = dynamic(() => import("./GundamInnerFrameCanvas"), {
  ssr: false,
});

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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

    if (headingRef.current) {
      setTimeout(() => {
        const el = headingRef.current;
        if (el) scramble(el, "Tamogh", 1200);
      }, 1000);
    }
  }, []);

  const jets = [
    { top: "14%", animation: "jet-curve-1", delay: 0, duration: 10.2, scale: 1.0, start: "-30vw", explodeAt: 0.58 },
    { top: "30%", animation: "jet-curve-2", delay: 1.1, duration: 11, scale: 0.9, start: "-32vw", explodeAt: 0.46 },
    { top: "52%", animation: "jet-curve-1", delay: 2.0, duration: 9.6, scale: 0.96, start: "-29vw", explodeAt: 0.66 },
    { top: "70%", animation: "jet-curve-2", delay: 3.0, duration: 10.5, scale: 0.86, start: "-34vw", explodeAt: 0.5 },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#f5f6f8" }}
    >
      <div className="absolute top-0 right-0 h-full" style={{ width: "55%", zIndex: 0 }}>
        {jets.map((jet, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              ["--jet-duration" as string]: `${jet.duration}s`,
              ["--jet-delay" as string]: `${jet.delay}s`,
              ["--explode-offset" as string]: `${jet.duration * jet.explodeAt}s`,
              top: jet.top,
              left: jet.start,
              zIndex: 2,
              animation: `${jet.animation} ${jet.duration}s linear infinite`,
              animationDelay: `${jet.delay}s`,
              opacity: 0.92,
              transform: `scale(${jet.scale})`,
            }}
          >
            <div
              className="jet-inner"
              style={{
                position: "relative",
                width: 128,
                height: 44,
                filter: "drop-shadow(0 0 8px rgba(15,85,222,0.16))",
              }}
            >
              <div className="jet-body">
                <div
                  style={{
                    position: "absolute",
                    left: 6,
                    top: 5,
                    width: 28,
                    height: 24,
                    clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                    background: "#cdd7e6",
                    border: "1px solid rgba(28,49,86,0.26)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    left: 16,
                    top: 13,
                    width: 56,
                    height: 16,
                    borderRadius: 999,
                    background: "linear-gradient(180deg, #f6f8fc, #d5deec)",
                    border: "1px solid rgba(28,49,86,0.24)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    left: 42,
                    top: 8,
                    width: 24,
                    height: 18,
                    clipPath: "polygon(0 0, 100% 32%, 84% 100%, 14% 100%, 0 30%)",
                    background: "#0f55de",
                    border: "1px solid rgba(15,85,222,0.26)",
                  }}
                />

                {[0, 1, 2].map((bulletIndex) => (
                  <div
                    key={`jet-bullet-${bulletIndex}`}
                    style={{
                      position: "absolute",
                      left: 84 + bulletIndex * 9,
                      top: 17 + bulletIndex,
                      width: 11,
                      height: 3,
                      borderRadius: 1,
                      background: bulletIndex === 0 ? "#0f55de" : "#6ea2ff",
                      boxShadow: "0 0 9px rgba(15,85,222,0.34)",
                      animation: `bullet-trace ${1.2 + bulletIndex * 0.08}s linear infinite`,
                      animationDelay: `${i * 0.18 + bulletIndex * 0.08}s`,
                    }}
                  />
                ))}

              </div>

              <div className="jet-explosion-wrap">
                <div className="jet-explosion-core" />
                <div className="jet-explosion-ring" />
                <div className="jet-explosion-ring jet-explosion-ring-2" />
                <div className="jet-explosion-smoke" />
                {Array.from({ length: 8 }).map((_, d) => (
                  <div key={d} className="jet-shard" style={{ ["--shard-angle" as string]: `${d * 45}deg` }} />
                ))}
                {Array.from({ length: 10 }).map((_, s) => (
                  <div key={`spark-${s}`} className="jet-sparkle" style={{ ["--spark-angle" as string]: `${s * 36}deg` }} />
                ))}
              </div>
            </div>
          </div>
        ))}

        {jets.map((jet, i) => (
          <div
            key={`robot-shot-${i}`}
            className="absolute pointer-events-none"
            style={{
              ["--jet-duration" as string]: `${jet.duration}s`,
              ["--jet-delay" as string]: `${jet.delay}s`,
              ["--explode-offset" as string]: `${jet.duration * jet.explodeAt}s`,
              ["--hit-distance" as string]: `${24 + i * 1.6}vw`,
              top: `calc(${jet.top} + ${34 + (i % 2) * 8}px)`,
              left: "36%",
              width: 320,
              height: 40,
              zIndex: 3,
            }}
          >
            {[0, 1].map((shot) => (
              <div
                key={shot}
                className="robot-shot"
                style={{
                  ["--arc-height" as string]: shot === 0 ? "-62px" : "-78px",
                  ["--arc-return" as string]: shot === 0 ? "-26px" : "-18px",
                  ["--turn-rot" as string]: shot === 0 ? "-42deg" : "-34deg",
                  top: shot === 0 ? 14 : 18,
                  background: shot === 0 ? "#ff3f2a" : "#ffd44d",
                  boxShadow:
                    shot === 0
                      ? "0 0 12px rgba(255,63,42,0.72)"
                      : "0 0 12px rgba(255,212,77,0.78)",
                  animationDelay: `calc(var(--jet-delay, 0s) + var(--explode-offset, 5s) - ${0.72 + shot * 0.12}s)`,
                }}
              />
            ))}
          </div>
        ))}

        <GundamInnerFrameCanvas />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #f5f6f8 0%, rgba(245,246,248,0.9) 36%, transparent 75%)",
          }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)",
          zIndex: 1,
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(245,246,248,0.95))",
          zIndex: 1,
        }}
      />

      <div className="relative z-10 w-full py-32" style={{ maxWidth: "1100px", margin: "0 auto", padding: "8rem 3rem" }}>
        <div className="max-w-xl">
          <div
            className="hero-tag inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase"
            style={{
              background: "rgba(0, 212, 255, 0.08)",
              border: "1px solid rgba(0, 212, 255, 0.2)",
              color: "var(--accent-blue)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: "var(--accent-blue)",
                boxShadow: "0 0 8px var(--accent-blue)",
                animation: "pulse-ring 1.5s ease-out infinite",
              }}
            />
            Machine Learning Engineer @ BlackRock
          </div>

          <h1 ref={headingRef} className="gundam-heading text-5xl md:text-7xl mb-4 leading-none">
            Tamogh
          </h1>

          <div ref={subtitleRef} className="mb-8" style={{ marginTop: "2rem" }}>
            <div
              className="glass rounded-2xl p-10 mb-10 neon-border mech-panel"
              style={{
                fontFamily: "var(--font-geist-mono)",
                background: "#ffffff",
                border: "1px solid rgba(15,32,58,0.14)",
                boxShadow: "0 12px 30px rgba(20,34,52,0.1)",
                padding: "2.5rem 2.2rem 2.5rem 3.2rem",
              }}
            >
              <div className="flex items-center gap-2 mb-10">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    display: "inline-block",
                    borderRadius: 2,
                    background: "#0f55de",
                    boxShadow: "0 0 8px rgba(15, 85, 222, 0.28)",
                  }}
                />
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
                <span className="ml-2 text-xs" style={{ color: "#51627a" }}>
                  tamogh@VU3TKI-workstation ~
                </span>
                <span style={{ flex: 1 }} />
                <span
                  style={{
                    width: 12,
                    height: 6,
                    background: "#facc15",
                    display: "inline-block",
                    animation: "blink 1.1s step-end infinite",
                  }}
                />
                <span
                  style={{
                    width: 12,
                    height: 6,
                    background: "#ef4444",
                    display: "inline-block",
                    animation: "blink 1.1s step-end infinite",
                    animationDelay: "0.3s",
                  }}
                />
              </div>
                <div className="space-y-3 text-sm" style={{ lineHeight: 1.6 }}>
                  <p style={{ color: "#0146ad" }}>$ cargo run --release -- deploy --model gpt2-ft</p>
                  <p style={{ color: "#42556d" }}>Building Docker runtime from user deps... ✓</p>
                  <p style={{ color: "#42556d" }}>Pushing to Azure Container Registry... ✓</p>
                  <p style={{ color: "var(--accent-blue)" }}>Deploying via KServe on AKS...</p>
                  <p style={{ color: "#42556d" }}>Health check: pod/gpt2-ft-0 Running ✓</p>
                  <p style={{ color: "#42556d" }}>KEDA autoscaler: minReplicas=1 maxReplicas=20</p>
                  <p style={{ color: "var(--accent-green)" }}>Inference endpoint live → /v1/models/gpt2-ft ✓</p>
                  <p style={{ color: "#084fa6" }}>Metrics streaming → Prometheus + Grafana</p>
                  <p className="flex items-center gap-1">
                    <span style={{ color: "var(--accent-green)" }}>$</span>
                    <span
                      className="w-2 h-4 cursor-blink"
                      style={{ background: "var(--accent-blue)", display: "inline-block" }}
                    />
                  </p>
              </div>
            </div>
          </div>

          <div ref={ctaRef} />
        </div>
      </div>
    </section>
  );
}
