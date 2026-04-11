"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-left",
        { opacity: 0, x: -60 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
      gsap.fromTo(
        ".about-right",
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1,
          scrollTrigger: { trigger: ".stat-grid", start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-40"
      style={{ background: "var(--bg-primary)" }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 3rem" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <div className="about-left">
            <p
              className="text-sm font-medium mb-3 tracking-widest uppercase"
              style={{ color: "var(--accent-blue)", fontFamily: "var(--font-geist-mono)" }}
            >
              01. About me

            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span style={{ color: "var(--text-primary)" }}>Building the{" "}</span>
              <span className="gradient-text">future</span>
              <br />
              <span style={{ color: "var(--text-primary)" }}>one model at a time</span>
            </h2>
            <div
              className="space-y-6 text-base leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              <p>
                              <br></br>
                I&apos;m a{" "}
                <span style={{ color: "var(--accent-blue)" }}>
                  Machine Learning Engineer at BlackRock
                </span>{" "}
                building a unified ML platform for registering, training, tuning, and
                deploying models across multi-cloud environments at production scale.
              </p>
              <p>
                My stack spans{" "}
                <span style={{ color: "var(--accent-purple)" }}>
                  Rust, KServe, KEDA, Azure, and PyTorch
                </span>
                . I was also a Google Summer of Code 2024 contributor, having integrated
                MCMC and Variational Inference into Neuroptimus for neuronal parameter
                estimation
              </p>
              <p>
                Completed a{" "}
                <span style={{ color: "var(--accent-green)" }}>
                  B.E. in Computer Science
                </span>{" "}
                at Thapar Institute of Engineering &amp; Technology
              </p>
            </div>

          </div>

          {/* Right */}
          <div className="about-right">
            {/* Animated terminal card */}
            <div
              className="glass rounded-2xl p-8 mb-8 neon-border"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
                <span className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
                <span
                  className="ml-2 text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  tamogh@ml-workstation ~
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p style={{ color: "var(--accent-green)" }}>
                  $ cargo run --release -- deploy --model gpt2-ft
                </p>
                <p style={{ color: "var(--text-secondary)" }}>
                  Building Docker runtime from user deps... ✓
                </p>
                <p style={{ color: "var(--text-secondary)" }}>
                  Pushing to Azure Container Registry... ✓
                </p>
                <p style={{ color: "var(--accent-blue)" }}>
                  Deploying via KServe on AKS...
                </p>
                <p style={{ color: "var(--text-secondary)" }}>
                  Health check: pod/gpt2-ft-0 Running ✓
                </p>
                <p style={{ color: "var(--text-secondary)" }}>
                  KEDA autoscaler: minReplicas=1 maxReplicas=20
                </p>
                <p style={{ color: "var(--accent-green)" }}>
                  Inference endpoint live → /v1/models/gpt2-ft ✓
                </p>
                <p style={{ color: "var(--accent-purple)" }}>
                  Metrics streaming → Prometheus + Grafana
                </p>
                <p className="flex items-center gap-1">
                  <span style={{ color: "var(--accent-green)" }}>$</span>
                  <span
                    className="w-2 h-4 cursor-blink"
                    style={{ background: "var(--accent-blue)", display: "inline-block" }}
                  />
                </p>
              </div>
            </div>
            <br></br>

            {/* Stats grid */}
            <div className="stat-grid grid grid-cols-2 gap-10">
              {[
                { value: "1+", label: "\n Years at\nBlackRock", color: "var(--accent-blue)" },
                { value: "GSoC", label: "\n 2024\nContributor", color: "var(--accent-purple)" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="stat-card glass rounded-xl p-6 text-center"
                  style={{ border: `1px solid ${stat.color}20` }}
                >
                  <div
                    className="text-3xl font-black mb-1"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-geist-mono)",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
