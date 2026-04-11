"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Unified ML Platform — BlackRock",
    description:
      "Production ML platform to register, train, tune, evaluate, and deploy open-source, proprietary, and third-party models across multi-cloud. Backend in Rust with DDD, KServe for serving, KEDA for event-driven autoscaling. Delivers model inference-as-a-service with full lifecycle monitoring via Grafana & Prometheus.",
    tags: ["Rust", "KServe", "KEDA", "Azure", "Docker", "PostgreSQL", "MinIO"],
    color: "var(--accent-blue)",
    metrics: ["Multi-cloud", "Event-driven scale", "Full lifecycle"],
    year: "2025",
  },
  {
    title: "ETL Pipeline Framework — BlackRock",
    description:
      "Production-grade ETL pipelines for financial data forming the backbone of a trade library. Built a test server framework enabling rapid creation and validation of pipelines without manual environment setup. Integrated LLM-based capabilities into legacy data workflows.",
    tags: ["Python", "Spark", "Airflow", "Luigi", "LLM", "PostgreSQL"],
    color: "var(--accent-purple)",
    metrics: ["Financial data", "Auto test framework", "LLM-augmented"],
    year: "2025",
  },
  {
    title: "Bayesian Inference — GSoC 2024",
    description:
      "Integrated MCMC and Variational Inference into Neuroptimus for neuronal parameter estimation under Dr. Sbalocz Kali at Google Summer of Code. Implemented global optimization techniques and custom loss functions for improved convergence.",
    tags: ["Python", "MCMC", "Variational Inference", "Neuroptimus", "SciPy"],
    color: "var(--accent-blue)",
    metrics: ["Google GSoC", "Bayesian ML", "Neuronal Params"],
    year: "2024",
  },
  {
    title: "Chemical Reaction Prediction",
    description:
      "Hybrid architecture combining Graph Attention Networks and Transformers to predict chemical reaction outcomes. Built local + global molecular embeddings capturing both structural and relational properties. Achieved 74% prediction accuracy.",
    tags: ["PyTorch", "GAT", "Transformers", "GNNs", "RDKit"],
    color: "var(--accent-green)",
    metrics: ["74% accuracy", "Hybrid GAT+TX", "May–Nov 2024"],
    year: "2024",
  },
  {
    title: "Soil Moisture Prediction — ThaparSat / ISRO",
    description:
      "CNN-based soil moisture prediction model trained on satellite-derived features under the ISRO program. Includes denoising algorithms for satellite-retrieved data and payload compression pipelines.",
    tags: ["PyTorch", "CNN", "Satellite Data", "Denoising", "Compression"],
    color: "var(--accent-purple)",
    metrics: ["ISRO Program", "CNN + Satellite", "Since 2022"],
    year: "2022",
  },
  {
    title: "Motion Amplification & Frequency Analysis",
    description:
      "Phase-based motion amplification and frequency extraction from video streams. Smart India Hackathon 2023 Finalist. Achieved 88% accuracy in micro-motion signal detection from raw video using FFT-based analysis.",
    tags: ["Python", "OpenCV", "Signal Processing", "Phase-based", "FFT"],
    color: "var(--accent-green)",
    metrics: ["88% accuracy", "SIH 2023 Finalist", "Real-time"],
    year: "2023",
  },
];

export default function ProjectsSection() {
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
        ".project-card",
        { opacity: 0, y: 70 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".projects-grid", start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, card: HTMLDivElement) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotX = ((y - midY) / midY) * -8;
    const rotY = ((x - midX) / midX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  };

  const handleMouseLeave = (card: HTMLDivElement) => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-40"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, var(--accent-purple), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 3rem" }}>
        <div ref={titleRef} className="mb-20">
          <p
            className="text-sm font-medium mb-3 tracking-widest uppercase"
            style={{ color: "var(--accent-blue)", fontFamily: "var(--font-geist-mono)" }}
          >
            03. Projects
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            <span style={{ color: "var(--text-primary)" }}>Things I&apos;ve{" "}</span>
            <span className="gradient-text">Built</span>
          </h2>
          <p style={{ color: "var(--text-secondary)" }} className="max-w-lg text-lg">
            Production ML systems, research prototypes, and everything in between.
          </p>
        </div>

        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <div
              key={i}
              className="project-card glass rounded-2xl p-8 flex flex-col transition-all duration-200"
              style={{
                border: `1px solid ${project.color}18`,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget as HTMLDivElement)}
              onMouseLeave={(e) => handleMouseLeave(e.currentTarget as HTMLDivElement)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${project.color}15` }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke={project.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-secondary)", fontFamily: "var(--font-geist-mono)" }}
                  >
                    {project.year}
                  </span>
                </div>
              </div>

              <h3
                className="text-xl font-bold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                {project.title}
              </h3>
              <p
                className="text-sm leading-loose mb-6 flex-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {project.description}
              </p>

              {/* Metrics */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.metrics.map((m, mi) => (
                  <span
                    key={mi}
                    className="px-2 py-1 rounded text-xs font-bold"
                    style={{
                      background: `${project.color}12`,
                      color: project.color,
                      fontFamily: "var(--font-geist-mono)",
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, ti) => (
                  <span
                    key={ti}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-geist-mono)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
