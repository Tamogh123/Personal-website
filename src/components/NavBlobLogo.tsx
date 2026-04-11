"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NavBlobLogo({ size = 44 }: { size?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.2;

    // ── Morphing blob ──
    const geo = new THREE.IcosahedronGeometry(1.15, 5);
    const origPositions = new Float32Array(geo.attributes.position.array);

    const solidMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x050e1f),
      emissive: new THREE.Color(0x0a1a35),
      transparent: true,
      opacity: 0.95,
      shininess: 120,
    });
    const solidMesh = new THREE.Mesh(geo, solidMat);
    scene.add(solidMesh);

    // Blue wireframe
    const wireGeo = new THREE.IcosahedronGeometry(1.17, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    scene.add(new THREE.Mesh(wireGeo, wireMat));

    // Purple wireframe
    const wireGeo2 = new THREE.IcosahedronGeometry(1.19, 1);
    const wireMat2 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    scene.add(new THREE.Mesh(wireGeo2, wireMat2));

    // ── Orbiting rings ──
    const makeRing = (r: number, tube: number, color: number, opacity: number, rx: number, ry: number, rz: number) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, tube, 4, 64),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
      );
      m.rotation.set(rx, ry, rz);
      scene.add(m);
      return m;
    };

    const ring1 = makeRing(1.58, 0.012, 0x00d4ff, 0.65, Math.PI / 2.2,  0.3,  0);
    const ring2 = makeRing(1.72, 0.009, 0x8b5cf6, 0.48, Math.PI / 3.5, -0.5,  0.8);
    const ring3 = makeRing(1.88, 0.006, 0x00ff88, 0.30, 1.1,            0.2, -0.4);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const blueLight = new THREE.PointLight(0x00d4ff, 4, 12);
    blueLight.position.set(2, 2, 3);
    scene.add(blueLight);
    const purpleLight = new THREE.PointLight(0x8b5cf6, 4, 12);
    purpleLight.position.set(-2, -2, 2);
    scene.add(purpleLight);
    const greenLight = new THREE.PointLight(0x00ff88, 1.5, 8);
    greenLight.position.set(0, -3, 1);
    scene.add(greenLight);

    // ── Displacement ──
    const displace = (x: number, y: number, z: number, t: number) =>
      Math.sin(x * 2.1 + t * 0.8) * Math.cos(y * 1.9 + t * 0.6) * 0.18 +
      Math.sin(y * 2.5 + t * 1.1) * Math.cos(z * 2.3 + t * 0.7) * 0.14 +
      Math.sin(z * 1.8 + t * 0.5) * Math.cos(x * 2.7 + t * 0.9) * 0.12 +
      Math.sin((x + y) * 1.5 + t * 1.3) * 0.07;

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Morph vertices
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ox = origPositions[i * 3];
        const oy = origPositions[i * 3 + 1];
        const oz = origPositions[i * 3 + 2];
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const nx = ox / len, ny = oy / len, nz = oz / len;
        const d = displace(nx, ny, nz, t);
        pos.setXYZ(i, ox + nx * d, oy + ny * d, oz + nz * d);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();

      solidMesh.rotation.y = t * 0.45;
      solidMesh.rotation.x = t * 0.22;

      ring1.rotation.z = t * 0.55;
      ring2.rotation.y = t * 0.42;
      ring3.rotation.x = -t * 0.30;

      blueLight.intensity   = 3.5 + Math.sin(t * 1.2) * 1.2;
      purpleLight.intensity = 3.5 + Math.sin(t * 0.9 + 1) * 1.2;
      greenLight.intensity  = 1.2 + Math.sin(t * 1.5 + 2) * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        filter: "drop-shadow(0 0 8px rgba(0,212,255,0.5))",
      }}
    />
  );
}
