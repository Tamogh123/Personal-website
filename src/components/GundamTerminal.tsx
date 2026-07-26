"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  "[BOOT] VU3TKI CAREER ENGINE INIT",
  "[PROFILE] PILOT: TAMOGH | ROLE: ML SYSTEMS ENGINEER",
  "[POWER] CORE BUS ONLINE | UPTIME TARGET: 99.95%",
  "[STACK] PYTHON • RUST • TYPESCRIPT • CLOUD MLOPS",
  "[SYSTEMS] MODEL SERVING | DATA PIPELINES | PLATFORM TOOLING",
  "[MISSION] BUILD RELIABLE, SCALABLE, HIGH-IMPACT AI SYSTEMS",
  "[PROJECT BAY] RESEARCH PROTOTYPES -> PRODUCTION DEPLOYMENTS",
  "[OPEN SOURCE] CONTRIBUTIONS ACTIVE | DOCUMENTATION SYNCED",
  "[DIAGNOSTICS] QUALITY GATES PASS | NO CRITICAL FAULTS",
  "[CONSOLE] Welcome, Pilot. Portfolio reactor is at nominal thrust.",
];

export default function GundamTerminal() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => {
      setLines((prev) => (prev.length < BOOT_LINES.length ? [...prev, BOOT_LINES[prev.length]] : prev));
      idx++;
      if (idx > BOOT_LINES.length) clearInterval(t);
    }, 420);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="gundam-terminal scanlines" role="region" aria-label="Gundam console">
      <div className="panel-header">
        <div className="gundam-knob" />
        <div>
          <div className="panel-title">VU3TKI CORE</div>
          <div className="panel-sub">Career engine diagnostics • v2.0</div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {lines.map((l, i) => (
          <div key={i} className="term-line">
            <span className="term-prefix">{i < 9 ? `0${i + 1}` : i + 1}:</span>
            <span className={l.includes("OK") ? "term-highlight" : ""}>{l}</span>
          </div>
        ))}

        {/* cursor */}
        <div style={{ height: 20 }}>
          <span className="term-prefix">{lines.length + 1 < 10 ? `0${lines.length + 1}` : lines.length + 1}:</span>
          <span className="cursor-blink">_</span>
        </div>
      </div>
    </div>
  );
}
