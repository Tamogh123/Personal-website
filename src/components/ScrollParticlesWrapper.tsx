"use client";

import dynamic from "next/dynamic";

const ScrollParticles = dynamic(() => import("./ScrollParticles"), { ssr: false });

export default function ScrollParticlesWrapper() {
  return <ScrollParticles />;
}
