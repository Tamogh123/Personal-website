"use client";

import { useEffect, useRef } from "react";

export default function GundamInnerFrame() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    // simple CSS-based animations are defined in globals.css; keep this lightweight
    return () => {};
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 320 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="gundam-acc" x1="0" x2="1">
          <stop offset="0" stopColor="#00D9FF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#3A7BFF" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <rect x="6" y="14" width="308" height="172" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

      {/* central ring */}
      <g transform="translate(160,100)">
        <circle r="34" fill="none" stroke="url(#gundam-acc)" strokeWidth="3" opacity="0.95" style={{ transformOrigin: '160px 100px', animation: 'rotate 8s linear infinite' } as any} />
        <circle r="18" fill="#0b1114" stroke="#0f2430" strokeWidth="2" />
      </g>

      {/* small greebles */}
      <rect x="40" y="40" width="18" height="6" fill="#0f1418" stroke="#0b1114" />
      <rect x="262" y="154" width="18" height="6" fill="#0f1418" stroke="#0b1114" />

      <style>{`
        @keyframes rotate { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </svg>
  );
}
