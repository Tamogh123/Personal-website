"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Node3D {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  layer: number;
  pulsePhase: number;
}

export default function NeuralNetCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Color palette
    const colors = {
      blue: new THREE.Color(0x00d4ff),
      purple: new THREE.Color(0x8b5cf6),
      green: new THREE.Color(0x00ff88),
    };

    // Build layered neural network nodes
    const layers = [4, 7, 10, 7, 4];
    const nodes: Node3D[] = [];
    const nodeObjects: THREE.Mesh[] = [];
    const layerSpacing = 7;

    const nodeMat = new THREE.MeshBasicMaterial({ color: colors.blue });
    const nodeGeo = new THREE.SphereGeometry(0.28, 12, 12);

    layers.forEach((count, li) => {
      const x = (li - (layers.length - 1) / 2) * layerSpacing;
      for (let ni = 0; ni < count; ni++) {
        const y = (ni - (count - 1) / 2) * 2.2;
        const z = (Math.random() - 0.5) * 2;
        const mesh = new THREE.Mesh(
          nodeGeo,
          new THREE.MeshBasicMaterial({
            color: li % 2 === 0 ? colors.blue : colors.purple,
            transparent: true,
            opacity: 0.9,
          })
        );
        mesh.position.set(x, y, z);
        scene.add(mesh);
        nodeObjects.push(mesh);
        nodes.push({
          position: mesh.position,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.005,
            (Math.random() - 0.5) * 0.005,
            (Math.random() - 0.5) * 0.003
          ),
          layer: li,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    });

    // Connections between adjacent layers
    const connectionLines: THREE.Line[] = [];
    let srcIdx = 0;
    for (let li = 0; li < layers.length - 1; li++) {
      const layerA = nodes.slice(srcIdx, srcIdx + layers[li]);
      const layerB = nodes.slice(srcIdx + layers[li], srcIdx + layers[li] + layers[li + 1]);
      layerA.forEach((a) => {
        layerB.forEach((b) => {
          if (Math.random() > 0.3) {
            const geo = new THREE.BufferGeometry().setFromPoints([
              a.position.clone(),
              b.position.clone(),
            ]);
            const mat = new THREE.LineBasicMaterial({
              color: li % 2 === 0 ? colors.blue : colors.purple,
              transparent: true,
              opacity: 0.55 + Math.random() * 0.35,
            });
            const line = new THREE.Line(geo, mat);
            scene.add(line);
            connectionLines.push(line);
          }
        });
      });
      srcIdx += layers[li];
    }

    // Floating particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: colors.blue,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
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

    // Animation
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera parallax
      camera.position.x += (mouseX * 4 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      // Rotate the whole scene subtly
      scene.rotation.y = elapsed * 0.03;

      // Pulse nodes
      nodeObjects.forEach((mesh, i) => {
        const node = nodes[i];
        const pulse = Math.sin(elapsed * 1.5 + node.pulsePhase) * 0.5 + 0.5;
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.5 + pulse * 0.5;
        mesh.scale.setScalar(1 + pulse * 0.3);
      });

      // Update connection line positions to follow nodes
      let lineIdx = 0;
      let sIdx = 0;
      for (let li = 0; li < layers.length - 1; li++) {
        const layerA = nodeObjects.slice(sIdx, sIdx + layers[li]);
        const layerB = nodeObjects.slice(sIdx + layers[li], sIdx + layers[li] + layers[li + 1]);
        layerA.forEach((a) => {
          layerB.forEach((b) => {
            if (lineIdx < connectionLines.length) {
              const line = connectionLines[lineIdx];
              const pts = [a.position, b.position];
              (line.geometry as THREE.BufferGeometry).setFromPoints(pts);
              lineIdx++;
            }
          });
        });
        sIdx += layers[li];
      }

      // Rotate particles slowly
      particles.rotation.y = elapsed * 0.02;
      particles.rotation.x = elapsed * 0.01;

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
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
