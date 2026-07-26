
"use client";

import { useEffect, useRef,useState,type CSSProperties } from "react";
import { gsap } from "gsap";
import Image from "next/image";
type Bullet = {
  id: number;
  x: number;
  y: number;
  travelX: number;
  duration: number;
  size: number;
};

type Spark = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
};
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const jets = [
  { top: "14%", animation: "jet-curve-1", delay: 0, duration: 10.2, scale: 1.0, start: "-30vw", explodeAt: 0.58 },
  { top: "30%", animation: "jet-curve-2", delay: 1.1, duration: 11, scale: 0.9, start: "-32vw", explodeAt: 0.46 },
  { top: "52%", animation: "jet-curve-1", delay: 2.0, duration: 9.6, scale: 0.96, start: "-29vw", explodeAt: 0.66 },
  { top: "70%", animation: "jet-curve-2", delay: 3.0, duration: 10.5, scale: 0.86, start: "-34vw", explodeAt: 0.5 },
  ];
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);

  const bulletIdRef = useRef(0);
  const sparkIdRef = useRef(0);

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
  const spawnBurst = () => {
    const section = sectionRef.current;
    const robot = robotRef.current;
    if (!section || !robot) return;

    const sectionRect = section.getBoundingClientRect();
    const robotRect = robot.getBoundingClientRect();

    const chosenJet = jets[Math.floor(Math.random() * jets.length)];
    const laneY = sectionRect.height * (parseFloat(chosenJet.top) / 100);

    const impactX =
      robotRect.left - sectionRect.left + robotRect.width * (0.34 + Math.random() * 0.34);
    const impactY =
      robotRect.top - sectionRect.top + robotRect.height * (0.18 + Math.random() * 0.56);

    const startX = -160 - Math.random() * 180;
    const travelX = impactX - startX;

    const count = 2 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
      const id = bulletIdRef.current++;
      const duration = 2120 + Math.random() * 550;
      const y = laneY + (Math.random() * 18 - 9);

      setBullets((prev) => [
        ...prev,
        {
          id,
          x: startX,
          y,
          travelX,
          duration,
          size: 2 + Math.random() * 1.4,
        },
      ]);

      window.setTimeout(() => {
        setBullets((prev) => prev.filter((b) => b.id !== id));

        const sparkId = sparkIdRef.current++;
        const sparkDuration = 320 + Math.random() * 160;

        setSparks((prev) => [
          ...prev,
          {
            id: sparkId,
            x: impactX,
            y: impactY,
          size: 38 + Math.random() * 12,
            duration: sparkDuration,
          },
        ]);

        window.setTimeout(() => {
          setSparks((prev) => prev.filter((s) => s.id !== sparkId));
        }, sparkDuration + 50);
      }, duration);
    }
  };

  spawnBurst();
  const timer = window.setInterval(spawnBurst, 1400);

  return () => window.clearInterval(timer);
}, []);
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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#f5f6f8" }}
    >
<div className="absolute inset-0 pointer-events-none z-20 overflow-hidden" aria-hidden="true">
  {bullets.map((b) => (
    <div
      key={b.id}
      className="bullet-tracer"
      style={
        {
          left: `${b.x}px`,
          top: `${b.y}px`,
          width: `${b.size * 14}px`,
          ["--travel-x" as any]: `${b.travelX}px`,
          ["--dur" as any]: `${b.duration}ms`,
        } as CSSProperties & Record<string, string>
      }
    />
  ))}

  {sparks.map((s) => (
    <div
      key={s.id}
      className="bullet-spark"
      style={
        {
          left: `${s.x}px`,
          top: `${s.y}px`,
          width: `${s.size}px`,
          height: `${s.size}px`,
          ["--spark-dur" as any]: `${s.duration}ms`,
        } as CSSProperties & Record<string, string>
      }
    />
  ))}
</div>  
      {/* Pseudo-3D Gundam image */}
      <div
        className="absolute inset-0"
        style={{ perspective: "900px", perspectiveOrigin: "70% 50%", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "120px" }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          const el = e.currentTarget.querySelector<HTMLElement>(".gundam-3d-wrap");
          if (el) {
            el.style.transform = `rotateY(${nx * 14}deg) rotateX(${-ny * 8}deg) scale(1.04)`;
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget.querySelector<HTMLElement>(".gundam-3d-wrap");
          if (el) el.style.transform = "rotateY(-6deg) rotateX(2deg) scale(1)";
        }}
      >
        <div
          ref={robotRef}
          className="gundam-3d-wrap"
          style={{
            position: "relative",
            width: 560,
            height: 700,
            transformStyle: "preserve-3d",
            transform: "rotateY(-6deg) rotateX(2deg) scale(1)",
            transition: "transform 0.12s ease-out",
            filter: "drop-shadow(-18px 24px 48px rgba(10,28,72,0.32)) drop-shadow(0 4px 18px rgba(15,85,222,0.14))",
          }}
        >
          {/* Full base image */}
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src="/base-image-cut.png"
              alt="Gundam mech"
              width={560}
              height={700}
              priority
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />

            {/* Right arm - animated overlay */}
            <div
              style={{
                position: "absolute",
                top: "140px",
                left: "0px",
                width: "213px",
                height: "355px",
                animation: "arm-right-swing 3.5s ease-in-out infinite",
                transformStyle: "preserve-3d",
                transformOrigin: "right center",
                zIndex: 10,
              }}
            >
              <Image
                src="/mech-right.png"
                alt="Right arm"
                width={213}
                height={355}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Left arm - animated overlay */}
            <div
              style={{
                position: "absolute",
                top: "140px",
                right: "0px",
                width: "214px",
                height: "355px",
                animation: "arm-left-swing 3.5s ease-in-out infinite",
                animationDelay: "0.3s",
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
                zIndex: 10,
              }}
            >
              <Image
                src="/mech-left.png"
                alt="Left arm"
                width={214}
                height={355}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </div>


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
<style jsx global>{`
  .bullet-tracer {
    position: absolute;
    height: 2px;
    transform-origin: left center;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1),
      rgba(0, 145, 248, 0.95),
      rgba(249, 25, 0, 0)
    );
    box-shadow: 0 0 10px rgba(127, 220, 255, 0.95), 0 0 24px rgba(127, 220, 255, 0.35);
    animation: bullet-fly var(--dur) linear forwards;
    will-change: transform, opacity;
  }

  @keyframes bullet-fly {
    0% {
      transform: translateX(0) scaleX(1);
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateX(var(--travel-x)) scaleX(1);
      opacity: 0;
    }
  }

  .bullet-spark {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 1) 0%,
      rgba(248, 178, 28, 0.95) 35%,
      rgba(255, 140, 0, 0.2) 70%,
      rgba(255, 140, 0, 0) 100%
    );
    box-shadow: 0 0 10px rgba(255, 180, 80, 0.95), 0 0 22px rgba(255, 120, 40, 0.5);
    transform: translate(-50%, -50%);
    animation: spark-pop var(--spark-dur) ease-out forwards;
    will-change: transform, opacity;
  }

  @keyframes spark-pop {
    0% {
      transform: translate(-50%, -50%) scale(0.2);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(2.2);
      opacity: 0;
    }
  }
`}</style>      
    </section>
  );
}
