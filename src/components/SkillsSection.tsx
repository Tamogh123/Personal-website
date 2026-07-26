"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    category: "ML / AI",
    color: "#facc15",
    items: [
      { name: "PyTorch", level: 93 },
      { name: "TensorFlow / Keras", level: 85 },
      { name: "Scikit-learn", level: 90 },
      { name: "Transformers / HuggingFace", level: 88 },
      { name: "OpenCV", level: 82 },
    ],
  },
  {
    category: "Systems & Backend",
    color: "#dc2626",
    items: [
      { name: "Python", level: 95 },
      { name: "Rust", level: 80 },
      { name: "Scala", level: 72 },
      { name: "C / C++", level: 75 },
      { name: "gRPC / REST", level: 85 },
    ],
  },
  {
    category: "Cloud & MLOps",
    color: "#2563eb",
    items: [
      { name: "Microsoft Azure", level: 85 },
      { name: "Docker / Kubernetes", level: 83 },
      { name: "KServe / KEDA", level: 80 },
      { name: "Apache Spark / Airflow", level: 78 },
      { name: "PostgreSQL / MinIO", level: 80 },
    ],
  },
  {
    category: "Arch. & Design",
    color: "#111827",
    items: [
      { name: "Domain-Driven Design", level: 85 },
      { name: "Microservices", level: 88 },
      { name: "SOLID Principles", level: 90 },
      { name: "Event-Driven Arch.", level: 80 },
      { name: "CQRS / Event Sourcing", level: 72 },
    ],
  },
];

const tags = [
  "Transformers", "GNNs", "Bayesian ML", "MCMC", "Variational Inference",
  "Computer Vision", "NLP", "ETL Pipelines", "KServe", "KEDA",
  "CI/CD", "Hadoop", "Luigi", "Grafana", "Prometheus", "tusd", "MinIO", "S3",
  "DDD", "Microservices", "SOLID", "Clean Architecture", "Hexagonal Arch.",
  "Event-Driven", "CQRS", "Event Sourcing", "API-First Design", "12-Factor App",
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".skill-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 75%" },
        }
      );

      // Animate skill bars
      gsap.fromTo(
        ".skill-bar-fill",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, stagger: 0.05, ease: "power2.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 70%" },
        }
      );

      gsap.fromTo(
        ".skill-tag",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: "back.out(1.7)",
          scrollTrigger: { trigger: tagsRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-40"
      style={{ background: "#f5f7fb" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(var(--accent-blue) 1px, transparent 1px),
            linear-gradient(90deg, var(--accent-blue) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 3rem" }}>
        <div ref={titleRef} className="mb-20">
          <p
            className="text-sm font-medium mb-3 tracking-widest uppercase"
            style={{ color: "var(--accent-blue)", fontFamily: "var(--font-mono)" }}
          >
            02. Skills
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-5"
            style={{ color: "#17263a" }}
          >
            Technical{" "}
            <span className="gradient-text">Arsenal</span>
          </h2>
          <p className="max-w-lg text-lg" style={{ color: "#42556d" }}>
            <br></br>
            From research to deployment — the full ML lifecycle.
          </p>
          <br></br>
        </div>

        {/* Skill cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {skills.map((group, gi) => (
            <div
              key={gi}
              className="skill-card glass rounded-2xl mech-panel"
              style={{
                border: `1px solid ${group.color === "#f59e0b" ? "rgba(245,158,11,0.12)" : group.color + "22"}`,
                background: "#ffffff",
                boxShadow: "0 10px 26px rgba(20,34,52,0.08)",
                padding: "2.25rem 2rem 2.25rem 2.9rem",
              }}
            >
              <h3
                className="text-lg font-bold mb-8"
                style={{ color: group.color, fontFamily: "var(--font-geist-mono)" }}
              >
                {group.category}
              </h3>
              <div className="space-y-5">
                {group.items.map((skill, si) => (
                  <div key={si}>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="text-sm"
                        style={{
                          color: "#1f3148",
                          fontFamily: "var(--font-geist-mono)",
                        }}
                      >
                        {skill.name}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: group.color }}
                      >
                        {skill.level}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "#dce6f8" }}
                    >
                      <div
                        className="skill-bar-fill h-full rounded-full origin-left"
                        style={{
                          width: `${skill.level}%`,
                          background: group.color,
                          boxShadow: `0 0 6px ${group.color}44`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div ref={tagsRef}>
          <p
            className="text-sm mb-8 tracking-widest uppercase font-medium"
            style={{ color: "#51627a", fontFamily: "var(--font-geist-mono)" }}
          >
            <br></br>
            Topics & Domains
          </p>
          <div className="flex flex-wrap gap-4">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="skill-tag px-5 py-3 rounded-full text-sm font-medium cursor-default transition-all duration-300"
                style={{
                  background: "rgba(0,212,255,0.06)",
                  border: "1px solid rgba(0,212,255,0.15)",
                  color: "#42556d",
                  fontFamily: "var(--font-geist-mono)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(0,212,255,0.15)";
                  el.style.color = "var(--accent-blue)";
                  el.style.borderColor = "rgba(0,212,255,0.4)";
                  el.style.boxShadow = "0 0 15px rgba(0,212,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(0,212,255,0.06)";
                  el.style.color = "#42556d";
                  el.style.borderColor = "rgba(0,212,255,0.15)";
                  el.style.boxShadow = "none";
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
