"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MorphingBlob() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.z = 5;

    // ── Blob geometry (icosahedron subdivided for smoothness) ──
    const geo = new THREE.IcosahedronGeometry(1.6, 6);

    // Store original vertex positions
    const posAttr = geo.attributes.position;
    const origPositions = new Float32Array(posAttr.array.length);
    origPositions.set(posAttr.array);

    // Solid blob material — gradient-ish via vertex colors
    const solidMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x0a1628),
      emissive: new THREE.Color(0x0d2240),
      transparent: true,
      opacity: 0.85,
      shininess: 80,
    });

    const solidMesh = new THREE.Mesh(geo, solidMat);
    scene.add(solidMesh);

    // Wireframe overlay
    const wireGeo = new THREE.IcosahedronGeometry(1.62, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x00d4ff),
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // Second wireframe — purple, slightly larger
    const wireGeo2 = new THREE.IcosahedronGeometry(1.65, 2);
    const wireMat2 = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x8b5cf6),
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const wireMesh2 = new THREE.Mesh(wireGeo2, wireMat2);
    scene.add(wireMesh2);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x00d4ff, 3, 12);
    blueLight.position.set(3, 3, 3);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 3, 12);
    purpleLight.position.set(-3, -2, 2);
    scene.add(purpleLight);

    const greenLight = new THREE.PointLight(0x00ff88, 1.5, 10);
    greenLight.position.set(0, -4, 1);
    scene.add(greenLight);

    // Outer glow sphere (big, transparent)
    const glowGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x00d4ff),
      transparent: true,
      opacity: 0.03,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowMesh);

    // ── Orbiting rings ──
    const makeRing = (
      innerR: number,
      outerR: number,
      color: number,
      opacity: number,
      rx: number,
      ry: number,
      rz: number
    ) => {
      const rGeo = new THREE.TorusGeometry(innerR, outerR, 4, 80);
      const rMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        wireframe: false,
      });
      const mesh = new THREE.Mesh(rGeo, rMat);
      mesh.rotation.set(rx, ry, rz);
      scene.add(mesh);
      return mesh;
    };

    const ring1 = makeRing(2.1, 0.008, 0x00d4ff, 0.55, Math.PI / 2.2, 0.3, 0);
    const ring2 = makeRing(2.3, 0.006, 0x8b5cf6, 0.40, Math.PI / 3.5, -0.5, 0.8);
    const ring3 = makeRing(2.55, 0.004, 0x00ff88, 0.25, 1.1,         0.2, -0.4);

    // Floating particles around the blob
    const particleCount = 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.2 + Math.random() * 1.4;
      pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.025,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse tracking for subtle parallax
    let mx = 0, my = 0;
    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Resize
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animation ──
    let animId: number;
    const clock = new THREE.Clock();

    // Noise-like displacement: layered sin waves
    const displace = (x: number, y: number, z: number, t: number): number => {
      const f1 = Math.sin(x * 2.1 + t * 0.8) * Math.cos(y * 1.9 + t * 0.6) * 0.18;
      const f2 = Math.sin(y * 2.5 + t * 1.1) * Math.cos(z * 2.3 + t * 0.7) * 0.14;
      const f3 = Math.sin(z * 1.8 + t * 0.5) * Math.cos(x * 2.7 + t * 0.9) * 0.12;
      const f4 = Math.sin((x + y) * 1.5 + t * 1.3) * 0.08;
      return f1 + f2 + f3 + f4;
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Morph blob vertices
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ox = origPositions[i * 3];
        const oy = origPositions[i * 3 + 1];
        const oz = origPositions[i * 3 + 2];

        // Normalize to get direction
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const nx = ox / len, ny = oy / len, nz = oz / len;

        const d = displace(nx, ny, nz, t);
        pos.setXYZ(i, ox + nx * d, oy + ny * d, oz + nz * d);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();

      // Rotate
      solidMesh.rotation.y = t * 0.18;
      solidMesh.rotation.x = t * 0.09;
      wireMesh.rotation.y  = t * 0.22;
      wireMesh.rotation.x  = t * 0.11;
      wireMesh2.rotation.y = -t * 0.14;
      wireMesh2.rotation.z = t * 0.07;
      particles.rotation.y = t * 0.05;
      particles.rotation.x = t * 0.03;

      // Orbit rings — each spins on a different axis
      ring1.rotation.z = t * 0.35;
      ring2.rotation.y = t * 0.28;
      ring3.rotation.x = -t * 0.22;

      // Mouse parallax
      camera.position.x += (mx * 0.6 - camera.position.x) * 0.05;
      camera.position.y += (-my * 0.4 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Pulse lights
      blueLight.intensity   = 2.5 + Math.sin(t * 1.2) * 1.0;
      purpleLight.intensity = 2.5 + Math.sin(t * 0.9 + 1) * 1.0;
      greenLight.intensity  = 1.0 + Math.sin(t * 1.5 + 2) * 0.5;

      // Pulse glow opacity
      (glowMesh.material as THREE.MeshBasicMaterial).opacity =
        0.02 + Math.sin(t * 0.8) * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
