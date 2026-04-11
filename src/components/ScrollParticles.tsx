"use client";

import { useEffect } from "react";

const CHARS = [
  "0xFF", "0x3A", "0x1B", "0xC4", "0xDE", "0xAD", "0xBE", "0xEF",
  "0x7F", "0x00", "0xF0", "0xAB", "10110", "01101", "11001", "00111",
  "∇L", "σ(x)", "∑wᵢ", "ReLU", "d/dx", "argmax", "∞", "λ=0.01",
  "GPU", "CUDA", "gRPC", "KV$", "Rust", "async",
];

const COLORS = ["#00d4ff", "#8b5cf6", "#00ff88", "#a78bfa", "#38bdf8"];

let lastScrollY = 0;
let ticking = false;

export default function ScrollParticles() {
  useEffect(() => {
    const container = document.getElementById("scroll-particles-root");
    if (!container) return;

    const emit = (scrollDelta: number) => {
      const count = Math.min(Math.floor(Math.abs(scrollDelta) / 18) + 1, 3);

      for (let i = 0; i < count; i++) {
        const el = document.createElement("span");
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const size = 9 + Math.random() * 5;
        const rightOffset = 14 + Math.random() * 18; // near the scrollbar
        const startY = window.scrollY + window.innerHeight * (0.2 + Math.random() * 0.6);

        el.textContent = char;
        el.style.cssText = `
          position: fixed;
          right: ${rightOffset}px;
          top: ${((startY - window.scrollY) / window.innerHeight) * 100}vh;
          font-size: ${size}px;
          font-family: 'Geist Mono', monospace;
          color: ${color};
          opacity: 1;
          pointer-events: none;
          z-index: 9999;
          text-shadow: 0 0 8px ${color};
          animation: scroll-particle ${0.7 + Math.random() * 0.4}s ease-out forwards;
          animation-delay: ${i * 60}ms;
          white-space: nowrap;
          font-weight: 600;
        `;

        container.appendChild(el);
        el.addEventListener("animationend", () => el.remove());
      }
    };

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          emit(delta);
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div id="scroll-particles-root" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }} />;
}
