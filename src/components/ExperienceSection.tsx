"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    role: "Machine Learning Engineer",
    company: "BlackRock",
    period: "Jul 2025 – Present",
    description:
      "Building a unified ML platform to register, train, tune, evaluate, and deploy open-source, proprietary, and third-party models across multi-cloud environments. Architected backend systems using Domain-Driven Design in Rust. Developed a custom model deployment service generating Docker runtimes dynamically. Orchestrating production inference with KServe and KEDA. Monitoring via Grafana and Prometheus.",
    tags: ["Rust", "KServe", "KEDA", "Azure", "DDD", "MinIO", "Prometheus"],
    color: "var(--accent-blue)",
  },
  {
    role: "Software Developer Intern",
    company: "BlackRock",
    period: "Jan 2025 – Jun 2025",
    description:
      "Developed and optimized ETL pipelines for financial data, forming the backbone of a production-grade trade library. Modernized legacy systems by integrating LLM-based capabilities into data workflows. Built a test server framework for rapid creation and validation of ETL pipelines without manual setup.",
    tags: ["Python", "ETL", "Spark", "LLM", "Airflow", "PostgreSQL"],
    color: "var(--accent-purple)",
  },
  {
    role: "Open Source Developer (GSoC 2024)",
    company: "Google Summer of Code · Neuroptimus",
    period: "May 2024 – Aug 2024",
    description:
      "Integrated Bayesian inference methods — MCMC and Variational Inference — into Neuroptimus for neuronal parameter estimation under mentor Dr. Sbalocz Kali. Implemented global optimization techniques and custom loss functions for improved convergence and accuracy.",
    tags: ["Python", "MCMC", "Variational Inference", "Bayesian ML", "Neuroptimus"],
    color: "var(--accent-green)",
  },
  {
    role: "Student Engineer Intern — ThaparSat",
    company: "ISRO Program · Thapar University",
    period: "May 2022 – Jul 2024",
    description:
      "Developed a soil moisture prediction model based on CNNs and other architectures using satellite-derived features under mentor Dr. Mamta Gulati. Worked on denoising algorithms for satellite-retrieved data and payload compression pipelines.",
    tags: ["PyTorch", "CNN", "Satellite", "Denoising", "Compression"],
    color: "var(--accent-blue)",
  },
];

export default function ExperienceSection() {
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
        ".exp-item",
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: ".exp-timeline", start: "top 75%" },
        }
      );

      // Animate the timeline line
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1, duration: 1.5, ease: "power2.out",
          scrollTrigger: { trigger: ".exp-timeline", start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-40"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 3rem" }}>
        <div ref={titleRef} className="mb-20">
          <p
            className="text-sm font-medium mb-3 tracking-widest uppercase"
            style={{ color: "var(--accent-blue)", fontFamily: "var(--font-geist-mono)" }}
          >
            04. Experience
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span style={{ color: "var(--text-primary)" }}>Where I&apos;ve{" "}</span>
            <span className="gradient-text">Worked</span>
          </h2>
        </div>

        <div className="exp-timeline relative">
          {/* Vertical timeline line */}
          <div
            className="timeline-line absolute top-0 bottom-0 w-px"
            style={{
              left: "16px",
              background: "linear-gradient(to bottom, var(--accent-blue), var(--accent-purple), transparent)",
            }}
          />

          <div className="space-y-16">
            {experiences.map((exp, i) => (
              <div key={i} className="exp-item relative" style={{ paddingLeft: "56px" }}>
                {/* Dot */}
                <div
                  className="absolute flex items-center justify-center rounded-full border-2"
                  style={{
                    left: 0,
                    top: "6px",
                    width: "32px",
                    height: "32px",
                    borderColor: exp.color,
                    background: "var(--bg-secondary)",
                    boxShadow: `0 0 15px ${exp.color}44`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: exp.color }}
                  />
                </div>

                {/* Content */}
                <div
                  className="glass rounded-2xl p-8 flex-1"
                  style={{ border: `1px solid ${exp.color}18` }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {exp.role}
                      </h3>
                      <p
                        className="text-sm font-medium"
                        style={{ color: exp.color }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: `${exp.color}10`,
                        color: exp.color,
                        border: `1px solid ${exp.color}30`,
                        fontFamily: "var(--font-geist-mono)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>

                  <p
                    className="text-sm leading-loose mb-6"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    {exp.tags.map((tag, ti) => (
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
