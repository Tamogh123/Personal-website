"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { animate } from "animejs";

const WHITE = 0xf7f8fb;
const WHITE_2 = 0xe8edf3;
const WHITE_3 = 0xdfe5ed;
const OUTLINE = 0x121722;
const DARK = 0x1b2028;
const BLUE = 0x85a7d8;
const GOLD = 0xd4bd77;

function whiteStandard(color = WHITE) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.08,
    roughness: 0.42,
  });
}

function darkStandard(color = DARK) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.16,
    roughness: 0.72,
  });
}

function accentMaterial(color: number) {
  return new THREE.MeshBasicMaterial({ color });
}

function addOutline(mesh: THREE.Mesh, color = OUTLINE) {
  const edges = new THREE.EdgesGeometry(mesh.geometry, 28);
  const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color }));
  lines.renderOrder = 10;
  mesh.add(lines);
}

function addBolt(parent: THREE.Object3D, x: number, y: number, z: number, scale = 0.28) {
  const bolt = new THREE.Mesh(new THREE.CylinderGeometry(scale, scale, scale * 0.45, 6), darkStandard());
  bolt.position.set(x, y, z);
  bolt.rotation.x = Math.PI / 2;
  addOutline(bolt);
  parent.add(bolt);
  return bolt;
}

function addVent(parent: THREE.Object3D, x: number, y: number, z: number, width = 3, count = 5) {
  const vent = new THREE.Group();
  for (let index = 0; index < count; index++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(width, 0.2, 0.28), darkStandard(0x272d36));
    fin.position.y = (index - (count - 1) / 2) * 0.36;
    addOutline(fin);
    vent.add(fin);
  }
  vent.position.set(x, y, z);
  parent.add(vent);
  return vent;
}

function addRingBearing(parent: THREE.Object3D, x: number, y: number, z: number, radius = 0.8, thickness = 0.18) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, thickness, 10, 22), darkStandard(0x2a313d));
  ring.rotation.x = Math.PI / 2;
  ring.position.set(x, y, z);
  addOutline(ring);
  parent.add(ring);
  return ring;
}

function addCableBundle(parent: THREE.Object3D, start: THREE.Vector3, end: THREE.Vector3) {
  const bundle = new THREE.Group();
  const points = [
    start.clone(),
    start.clone().lerp(end, 0.25).add(new THREE.Vector3(0, 0.8, 0.6)),
    start.clone().lerp(end, 0.55).add(new THREE.Vector3(0, -0.4, -0.3)),
    end.clone(),
  ];
  const curve = new THREE.CatmullRomCurve3(points);
  for (let offset = -1; offset <= 1; offset++) {
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 22, 0.08 + Math.abs(offset) * 0.03, 6, false),
      darkStandard(offset === 0 ? 0x2f3744 : 0x3a424d)
    );
    addOutline(tube);
    tube.position.z = offset * 0.08;
    bundle.add(tube);
  }
  parent.add(bundle);
  return bundle;
}

function addHydraulicRod(parent: THREE.Object3D, x: number, y: number, z: number, length = 5, vertical = true) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, length, 8), darkStandard(0x2a313d));
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, length * 0.65, 8), whiteStandard(WHITE_2));
  const capTop = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), darkStandard(0x353d49));
  const capBottom = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), darkStandard(0x353d49));
  if (vertical) {
    body.rotation.x = Math.PI / 2;
    rod.rotation.x = Math.PI / 2;
    capTop.position.x = length * 0.5;
    capBottom.position.x = -length * 0.5;
  } else {
    capTop.position.y = length * 0.5;
    capBottom.position.y = -length * 0.5;
  }
  group.add(body, rod, capTop, capBottom);
  group.position.set(x, y, z);
  parent.add(group);
  [body, rod, capTop, capBottom].forEach(addOutline);
  return group;
}

function addMotor(parent: THREE.Object3D, x: number, y: number, z: number) {
  const group = new THREE.Group();
  const housing = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3.2, 12), whiteStandard(WHITE_3));
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 2.4, 8), darkStandard());
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.15, 8, 18), darkStandard(0x2c333d));
  ring.rotation.x = Math.PI / 2;
  shaft.position.x = 1.2;
  group.add(housing, shaft, ring);
  group.position.set(x, y, z);
  parent.add(group);
  [housing, shaft, ring].forEach(addOutline);
  return group;
}

function addGear(parent: THREE.Object3D, x: number, y: number, z: number, radius = 1.15) {
  const group = new THREE.Group();
  const gear = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.45, 12), whiteStandard(WHITE_2));
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.36, radius * 0.36, 0.7, 10), darkStandard());
  hub.rotation.x = Math.PI / 2;
  gear.rotation.x = Math.PI / 2;
  group.add(gear, hub);
  for (let tooth = 0; tooth < 10; tooth++) {
    const angle = (tooth / 10) * Math.PI * 2;
    const tab = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.52, 0.18), whiteStandard(WHITE));
    tab.position.set(Math.cos(angle) * (radius + 0.1), Math.sin(angle) * (radius + 0.1), 0);
    tab.rotation.z = angle;
    addOutline(tab);
    group.add(tab);
  }
  group.position.set(x, y, z);
  parent.add(group);
  [gear, hub].forEach(addOutline);
  return group;
}

function addThruster(parent: THREE.Object3D, x: number, y: number, z: number, scale = 1) {
  const group = new THREE.Group();
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.8 * scale, 1.0 * scale, 2.2 * scale, 12), whiteStandard(WHITE));
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.46 * scale, 0.54 * scale, 1.8 * scale, 10), darkStandard(0x363d49));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.58 * scale, 0.12 * scale, 8, 18), darkStandard(0x2c333d));
  const glow = new THREE.Mesh(
    new THREE.ConeGeometry(0.28 * scale, 1.4 * scale, 10),
    new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.35 })
  );
  cap.rotation.z = Math.PI / 2;
  exhaust.rotation.z = Math.PI / 2;
  ring.rotation.y = Math.PI / 2;
  glow.rotation.z = -Math.PI / 2;
  exhaust.position.x = 1.1 * scale;
  ring.position.x = -0.55 * scale;
  glow.position.x = 2.0 * scale;
  group.add(cap, exhaust, ring, glow);
  group.position.set(x, y, z);
  glow.userData.isThrusterGlow = true;
  parent.add(group);
  [cap, exhaust, ring].forEach(addOutline);
  return group;
}

function addMuscleShell(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  radius = 0.8,
  length = 2.8,
  color = WHITE_2,
  rotZ = 0
) {
  const shell = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 6, 14), whiteStandard(color));
  shell.position.set(x, y, z);
  shell.rotation.z = rotZ;
  addOutline(shell);
  parent.add(shell);
  return shell;
}

function addPanel(parent: THREE.Object3D, x: number, y: number, z: number, w: number, h: number, d = 0.4, color = WHITE) {
  const panel = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), whiteStandard(color));
  panel.position.set(x, y, z);
  addOutline(panel);
  parent.add(panel);
  return panel;
}

function addTriArmor(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  radius = 1.2,
  depth = 1.0,
  color = WHITE_2,
  rot = new THREE.Euler()
) {
  const tri = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 3), whiteStandard(color));
  tri.position.set(x, y, z);
  tri.rotation.copy(rot);
  addOutline(tri);
  parent.add(tri);
  return tri;
}

function addPolyMuscle(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  radius = 0.9,
  color = WHITE,
  scale = new THREE.Vector3(1, 1, 1)
) {
  const poly = new THREE.Mesh(new THREE.OctahedronGeometry(radius), whiteStandard(color));
  poly.position.set(x, y, z);
  poly.scale.copy(scale);
  addOutline(poly);
  parent.add(poly);
  return poly;
}

function addFinger(parent: THREE.Object3D, x: number, y: number, z: number, length = 1.15) {
  const finger = new THREE.Group();
  const knuckle = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.5, 8), darkStandard());
  const middle = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, length * 0.72, 7), whiteStandard(WHITE_2));
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.11, length * 0.42, 7), whiteStandard(WHITE));
  middle.rotation.z = Math.PI / 2;
  tip.rotation.z = -Math.PI / 2;
  middle.position.y = -0.37;
  tip.position.y = -0.88;
  finger.add(knuckle, middle, tip);
  finger.position.set(x, y, z);
  finger.rotation.x = -0.25;
  [knuckle, middle, tip].forEach(addOutline);
  parent.add(finger);
  return finger;
}

function addSpear(parent: THREE.Object3D, side: number) {
  const spear = new THREE.Group();

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 52.0, 14), darkStandard(0x202733));
  const tipCore = new THREE.Mesh(new THREE.ConeGeometry(0.94, 5.2, 8), whiteStandard(WHITE));
  const tipBlade = new THREE.Mesh(new THREE.ConeGeometry(0.56, 4.0, 7), whiteStandard(WHITE_2));
  const tipFrustum = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.86, 2.2, 8), whiteStandard(WHITE_3));
  const tipCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 1.2, 10), darkStandard(0x2f3744));

  const rearCap = new THREE.Mesh(new THREE.ConeGeometry(0.58, 2.6, 7), darkStandard(0x2d3643));
  const gripMain = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 4.6, 12), darkStandard(0x2a313d));
  const gripRear = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 3.3, 12), darkStandard(0x323b49));
  const gripFront = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.6, 12), darkStandard(0x2d3440));

  const squareGuard = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 2.2), whiteStandard(WHITE_2));
  const squareCore = new THREE.Mesh(new THREE.BoxGeometry(1.25, 2.2, 1.25), darkStandard(0x2e3642));
  const squareMid = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.2, 1.45), whiteStandard(WHITE_3));

  const diamondA = new THREE.Mesh(new THREE.OctahedronGeometry(0.76), whiteStandard(WHITE));
  const diamondB = new THREE.Mesh(new THREE.OctahedronGeometry(0.64), whiteStandard(WHITE_3));
  const diamondC = new THREE.Mesh(new THREE.OctahedronGeometry(0.58), whiteStandard(WHITE_2));

  const pyramidL = new THREE.Mesh(new THREE.ConeGeometry(0.46, 1.7, 4), whiteStandard(WHITE_2));
  const pyramidR = new THREE.Mesh(new THREE.ConeGeometry(0.46, 1.7, 4), whiteStandard(WHITE_2));
  const pyramidL2 = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.35, 4), whiteStandard(WHITE));
  const pyramidR2 = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.35, 4), whiteStandard(WHITE));

  const rearFrustum = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.7, 2.2, 8), darkStandard(0x303946));
  const midFrustumA = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.72, 1.5, 8), darkStandard(0x344051));
  const midFrustumB = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.52, 1.5, 8), darkStandard(0x344051));

  tipCore.position.y = 28.2;
  tipBlade.position.y = 31.8;
  tipFrustum.position.y = 25.7;
  tipCollar.position.y = 24.0;

  rearCap.position.y = -27.2;
  rearCap.rotation.x = Math.PI;

  gripMain.position.y = -2.8;
  gripRear.position.y = -8.4;
  gripFront.position.y = 1.8;

  squareGuard.position.y = 20.8;
  squareCore.position.y = 18.5;
  squareMid.position.y = 11.4;
  diamondA.position.y = 14.6;
  diamondB.position.y = 5.8;
  diamondC.position.y = -12.6;

  rearFrustum.position.y = -22.9;
  midFrustumA.position.y = -1.0;
  midFrustumB.position.y = -15.8;

  pyramidL.position.set(1.42, 20.2, 0);
  pyramidR.position.set(-1.42, 20.2, 0);
  pyramidL2.position.set(1.12, 11.0, 0);
  pyramidR2.position.set(-1.12, 11.0, 0);
  pyramidL.rotation.z = Math.PI / 2;
  pyramidR.rotation.z = -Math.PI / 2;
  pyramidL2.rotation.z = Math.PI / 2;
  pyramidR2.rotation.z = -Math.PI / 2;

  [
    shaft,
    tipCore,
    tipBlade,
    tipFrustum,
    tipCollar,
    rearCap,
    gripMain,
    gripRear,
    gripFront,
    squareGuard,
    squareCore,
    squareMid,
    diamondA,
    diamondB,
    diamondC,
    pyramidL,
    pyramidR,
    pyramidL2,
    pyramidR2,
    rearFrustum,
    midFrustumA,
    midFrustumB,
  ].forEach(addOutline);

  spear.add(
    shaft,
    tipCore,
    tipBlade,
    tipFrustum,
    tipCollar,
    rearCap,
    gripMain,
    gripRear,
    gripFront,
    squareGuard,
    squareCore,
    squareMid,
    diamondA,
    diamondB,
    diamondC,
    pyramidL,
    pyramidR,
    pyramidL2,
    pyramidR2,
    rearFrustum,
    midFrustumA,
    midFrustumB
  );

  spear.position.set(side * 11.5, -4.4, 0.5);
  spear.rotation.z = side > 0 ? -0.25 : 0.25;
  spear.rotation.x = 0.1;

  parent.add(spear);
  return spear;
}

function buildHand(scene: THREE.Scene, side: number) {
  const hand = new THREE.Group();
  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.95, 10, 10), whiteStandard(WHITE_2));
  palm.position.set(side * 9.9, -4.2, 0.0);
  palm.scale.set(1.25, 1.0, 0.95);
  addOutline(palm);
  hand.add(palm);

  const palmBrace = new THREE.Mesh(new THREE.OctahedronGeometry(0.7), whiteStandard(WHITE_3));
  palmBrace.position.set(side * 9.8, -3.35, 0.68);
  palmBrace.scale.set(1.6, 0.55, 1.0);
  addOutline(palmBrace);
  hand.add(palmBrace);

  const knuckleCone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.55, 6), whiteStandard(WHITE));
  knuckleCone.rotation.z = -Math.PI / 2;
  knuckleCone.position.set(side * 10.65, -3.45, 0.8);
  addOutline(knuckleCone);
  hand.add(knuckleCone);

  const wristCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 1.0, 8), darkStandard(0x2d3440));
  wristCuff.rotation.z = Math.PI / 2;
  wristCuff.position.set(side * 9.2, -4.2, 0.0);
  addOutline(wristCuff);
  hand.add(wristCuff);

  addRingBearing(hand, side * 9.9, -3.8, 0.5, 0.45, 0.12);
  addFinger(hand, side * 10.3, -4.7, 0.3, 1.0);
  addFinger(hand, side * 10.0, -4.75, 0.55, 1.08);
  addFinger(hand, side * 9.7, -4.78, 0.55, 1.08);
  addFinger(hand, side * 9.4, -4.72, 0.3, 1.0);
  const thumb = new THREE.Mesh(new THREE.ConeGeometry(0.23, 1.2, 6), whiteStandard(WHITE));
  thumb.position.set(side * 10.35, -4.05, -0.65);
  thumb.rotation.x = Math.PI / 2;
  thumb.rotation.z = side * 0.35;
  addOutline(thumb);
  hand.add(thumb);

  const thumbBase = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32), whiteStandard(WHITE_2));
  thumbBase.position.set(side * 10.1, -3.95, -0.7);
  addOutline(thumbBase);
  hand.add(thumbBase);

  addVent(hand, side * 9.8, -3.9, -0.7, 0.8, 3);
  addBolt(hand, side * 9.2, -3.6, 0.8, 0.13);
  addBolt(hand, side * 10.3, -3.6, 0.8, 0.13);
  scene.add(hand);
  return hand;
}

function buildNeck(scene: THREE.Scene) {
  const neck = new THREE.Group();
  const upperRing = addRingBearing(neck, 0, 20.7, 0.2, 0.72, 0.16);
  const lowerRing = addRingBearing(neck, 0, 19.4, 0.2, 0.82, 0.18);
  const centerColumn = addPanel(neck, 0, 20.0, 0.0, 1.0, 2.0, 0.9, WHITE_2);
  addHydraulicRod(neck, -0.9, 20.0, -0.3, 1.6, false);
  addHydraulicRod(neck, 0.9, 20.0, -0.3, 1.6, false);
  addCableBundle(neck, new THREE.Vector3(-0.9, 19.2, -0.4), new THREE.Vector3(-1.8, 18.1, -1.2));
  addCableBundle(neck, new THREE.Vector3(0.9, 19.2, -0.4), new THREE.Vector3(1.8, 18.1, -1.2));
  neck.add(upperRing, lowerRing, centerColumn);
  scene.add(neck);
  return neck;
}

function buildWaist(scene: THREE.Scene) {
  const waist = new THREE.Group();
  const ring = addRingBearing(waist, 0, 6.4, 0.0, 1.55, 0.2);
  const belt = addPanel(waist, 0, 5.6, 0.0, 5.6, 1.6, 1.6, WHITE_2);
  const skirtFront = addPanel(waist, 0, 3.8, 1.2, 5.4, 3.0, 1.0, WHITE);
  const skirtBack = addPanel(waist, 0, 3.8, -1.2, 5.2, 2.4, 1.0, WHITE_3);
  addHydraulicRod(waist, -2.0, 4.8, -1.0, 2.2, false);
  addHydraulicRod(waist, 2.0, 4.8, -1.0, 2.2, false);
  addBolt(waist, -2.5, 6.0, 1.0, 0.14);
  addBolt(waist, 2.5, 6.0, 1.0, 0.14);
  waist.add(ring, belt, skirtFront, skirtBack);
  scene.add(waist);
  return waist;
}

function buildPelvis(scene: THREE.Scene) {
  const pelvis = new THREE.Group();
  const core = addPanel(pelvis, 0, 0.2, 0, 4.8, 3.6, 2.0, WHITE_2);
  const hipL = addGear(pelvis, -2.3, -0.3, 0.7, 0.72);
  const hipR = addGear(pelvis, 2.3, -0.3, 0.7, 0.72);
  const truss = addPanel(pelvis, 0, -1.6, 0, 1.4, 2.5, 1.2, WHITE_3);
  addBolt(pelvis, -1.7, 1.2, 1.0, 0.12);
  addBolt(pelvis, 1.7, 1.2, 1.0, 0.12);
  addCableBundle(pelvis, new THREE.Vector3(-1.8, 0.0, -0.7), new THREE.Vector3(-2.8, -1.5, -1.4));
  addCableBundle(pelvis, new THREE.Vector3(1.8, 0.0, -0.7), new THREE.Vector3(2.8, -1.5, -1.4));
  pelvis.add(core, hipL, hipR, truss);
  scene.add(pelvis);
  return pelvis;
}

function buildTorso(scene: THREE.Scene) {
  const torso = new THREE.Group();
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 3.1, 10.8, 12), whiteStandard(WHITE));
  chest.position.set(0, 13.0, 0.1);
  addOutline(chest);
  torso.add(chest);

  const upperChest = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 3.9, 3.6, 10), whiteStandard(WHITE_2));
  upperChest.position.set(0, 15.7, 1.15);
  upperChest.rotation.x = Math.PI / 2;
  addOutline(upperChest);
  torso.add(upperChest);

  const lowerChest = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.5, 3.2, 10), whiteStandard(WHITE_3));
  lowerChest.position.set(0, 9.5, 1.0);
  lowerChest.rotation.x = Math.PI / 2;
  addOutline(lowerChest);
  torso.add(lowerChest);

  const chestHemL = new THREE.Mesh(new THREE.SphereGeometry(2.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), whiteStandard(WHITE_2));
  const chestHemR = new THREE.Mesh(new THREE.SphereGeometry(2.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), whiteStandard(WHITE_2));
  chestHemL.position.set(-3.4, 15.0, 1.4);
  chestHemR.position.set(3.4, 15.0, 1.4);
  chestHemL.rotation.x = Math.PI / 2;
  chestHemR.rotation.x = Math.PI / 2;
  addOutline(chestHemL);
  addOutline(chestHemR);
  torso.add(chestHemL, chestHemR);

  const sternumPyramid = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.8, 4), whiteStandard(WHITE_3));
  sternumPyramid.position.set(0, 12.1, 2.2);
  sternumPyramid.rotation.z = Math.PI / 4;
  addOutline(sternumPyramid);
  torso.add(sternumPyramid);
  const pecL = addTriArmor(torso, -3.8, 14.8, 2.2, 1.8, 1.4, WHITE, new THREE.Euler(0, 0, 1.6));
  const pecR = addTriArmor(torso, 3.8, 14.8, 2.2, 1.8, 1.4, WHITE, new THREE.Euler(0, 0, -1.6));
  const absL = addTriArmor(torso, -2.4, 10.9, 1.9, 1.1, 1.0, WHITE_2, new THREE.Euler(0, 0, 1.57));
  const absR = addTriArmor(torso, 2.4, 10.9, 1.9, 1.1, 1.0, WHITE_2, new THREE.Euler(0, 0, -1.57));
  const centerCore = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 1.0, 1.8, 12), accentMaterial(GOLD));
  centerCore.position.set(0, 13.0, 2.0);
  centerCore.rotation.x = Math.PI / 2;
  addOutline(centerCore, OUTLINE);
  const reactorRingOuter = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.14, 10, 24), darkStandard(0x2d3440));
  const reactorRingInner = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.12, 10, 22), darkStandard(0x39424e));
  reactorRingOuter.rotation.x = Math.PI / 2;
  reactorRingInner.rotation.x = Math.PI / 2;
  reactorRingOuter.position.set(0, 13.0, 2.0);
  reactorRingInner.position.set(0, 13.0, 2.0);
  addOutline(reactorRingOuter);
  addOutline(reactorRingInner);

  const coreHeart = new THREE.Mesh(new THREE.SphereGeometry(0.88, 14, 14), darkStandard(0x05070b));
  coreHeart.position.set(0, 13.0, 5.25);
  addOutline(coreHeart, 0x7c8799);

  const coreCasing = new THREE.Mesh(new THREE.BoxGeometry(2.55, 1.75, 1.35), darkStandard(0x0f141c));
  coreCasing.position.set(0, 13.0, 4.75);
  addOutline(coreCasing, 0x8892a4);

  const blackModuleL = new THREE.Mesh(new THREE.BoxGeometry(1.25, 2.75, 1.1), darkStandard(0x131922));
  const blackModuleR = new THREE.Mesh(new THREE.BoxGeometry(1.25, 2.75, 1.1), darkStandard(0x131922));
  blackModuleL.position.set(-2.5, 13.15, 4.6);
  blackModuleR.position.set(2.5, 13.15, 4.6);
  blackModuleL.rotation.z = 0.1;
  blackModuleR.rotation.z = -0.1;
  addOutline(blackModuleL, 0x7e8a9c);
  addOutline(blackModuleR, 0x7e8a9c);

  const blackPodL = new THREE.Mesh(new THREE.SphereGeometry(0.52, 10, 10), darkStandard(0x090d14));
  const blackPodR = new THREE.Mesh(new THREE.SphereGeometry(0.52, 10, 10), darkStandard(0x090d14));
  blackPodL.position.set(-1.25, 11.95, 5.0);
  blackPodR.position.set(1.25, 11.95, 5.0);
  addOutline(blackPodL, 0x748094);
  addOutline(blackPodR, 0x748094);

  const coreFrame = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.16, 10, 22), darkStandard(0x161d28));
  coreFrame.rotation.x = Math.PI / 2;
  coreFrame.position.set(0, 13.0, 4.55);
  addOutline(coreFrame, 0x8d98ab);

  const sternumEngine = addMotor(torso, 0, 11.7, 1.4);
  sternumEngine.scale.set(0.62, 0.62, 0.62);
  sternumEngine.rotation.z = Math.PI / 2;

  const auxEngineL = addMotor(torso, -3.5, 12.7, 1.6);
  const auxEngineR = addMotor(torso, 3.5, 12.7, 1.6);
  auxEngineL.scale.set(0.54, 0.54, 0.54);
  auxEngineR.scale.set(0.54, 0.54, 0.54);
  auxEngineL.rotation.z = Math.PI / 2;
  auxEngineR.rotation.z = Math.PI / 2;

  const chestGearCenter = addGear(torso, 0, 13.0, 2.42, 0.62);
  const chestGearL = addGear(torso, -1.9, 13.2, 2.35, 0.52);
  const chestGearR = addGear(torso, 1.9, 13.2, 2.35, 0.52);
  const chestGearUpper = addGear(torso, 0, 14.7, 2.52, 0.44);
  const chestGearLower = addGear(torso, 0, 11.3, 2.48, 0.4);
  const chestGearUL = addGear(torso, -1.2, 14.0, 2.47, 0.35);
  const chestGearUR = addGear(torso, 1.2, 14.0, 2.47, 0.35);
  chestGearL.rotation.z = 0.2;
  chestGearR.rotation.z = -0.2;
  chestGearUpper.rotation.z = 0.15;
  chestGearLower.rotation.z = -0.14;

  const intakeTop = addVent(torso, 0, 15.0, 2.55, 1.55, 4);
  const intakeLower = addVent(torso, 0, 10.9, 2.45, 1.8, 4);
  const intakeLeft = addVent(torso, -2.75, 12.9, 2.55, 0.95, 4);
  const intakeRight = addVent(torso, 2.75, 12.9, 2.55, 0.95, 4);
  const chestRodUpper = addHydraulicRod(torso, 0, 14.2, 1.65, 4.5, true);
  const chestRodLower = addHydraulicRod(torso, 0, 11.7, 1.65, 3.8, true);
  const chestBraceL = addHydraulicRod(torso, -1.95, 12.6, 2.15, 3.2, false);
  const chestBraceR = addHydraulicRod(torso, 1.95, 12.6, 2.15, 3.2, false);
  chestRodUpper.rotation.z = Math.PI / 2;
  chestRodLower.rotation.z = Math.PI / 2;
  chestBraceL.rotation.z = -0.72;
  chestBraceR.rotation.z = 0.72;

  const ribPlateTopL = addPanel(torso, -3.2, 15.8, 2.0, 2.2, 0.65, 0.72, WHITE_3);
  const ribPlateTopR = addPanel(torso, 3.2, 15.8, 2.0, 2.2, 0.65, 0.72, WHITE_3);
  const ribPlateMidL = addPanel(torso, -3.35, 13.0, 2.1, 2.4, 0.65, 0.74, WHITE_2);
  const ribPlateMidR = addPanel(torso, 3.35, 13.0, 2.1, 2.4, 0.65, 0.74, WHITE_2);
  const ribPlateLowL = addPanel(torso, -2.95, 10.5, 2.0, 2.0, 0.6, 0.7, WHITE_3);
  const ribPlateLowR = addPanel(torso, 2.95, 10.5, 2.0, 2.0, 0.6, 0.7, WHITE_3);
  ribPlateTopL.rotation.z = -0.24;
  ribPlateTopR.rotation.z = 0.24;
  ribPlateMidL.rotation.z = -0.15;
  ribPlateMidR.rotation.z = 0.15;

  const avionicsBoxL = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.4, 0.95), darkStandard(0x0f141d));
  const avionicsBoxR = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.4, 0.95), darkStandard(0x0f141d));
  avionicsBoxL.position.set(-4.05, 12.2, 2.45);
  avionicsBoxR.position.set(4.05, 12.2, 2.45);
  avionicsBoxL.rotation.z = -0.12;
  avionicsBoxR.rotation.z = 0.12;
  addOutline(avionicsBoxL, 0x7b879a);
  addOutline(avionicsBoxR, 0x7b879a);

  const manifoldL = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 2.1, 8), darkStandard(0x1d2430));
  const manifoldR = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 2.1, 8), darkStandard(0x1d2430));
  manifoldL.position.set(-4.35, 11.2, 2.3);
  manifoldR.position.set(4.35, 11.2, 2.3);
  manifoldL.rotation.z = Math.PI / 2;
  manifoldR.rotation.z = Math.PI / 2;
  addOutline(manifoldL, 0x6f7b8e);
  addOutline(manifoldR, 0x6f7b8e);

  addCableBundle(torso, new THREE.Vector3(-3.4, 12.7, 1.6), new THREE.Vector3(-0.9, 13.1, 2.25));
  addCableBundle(torso, new THREE.Vector3(3.4, 12.7, 1.6), new THREE.Vector3(0.9, 13.1, 2.25));
  addCableBundle(torso, new THREE.Vector3(-4.05, 12.2, 2.45), new THREE.Vector3(-1.35, 14.3, 2.65));
  addCableBundle(torso, new THREE.Vector3(4.05, 12.2, 2.45), new THREE.Vector3(1.35, 14.3, 2.65));
  addCableBundle(torso, new THREE.Vector3(-4.35, 11.2, 2.25), new THREE.Vector3(-2.05, 10.8, 2.5));
  addCableBundle(torso, new THREE.Vector3(4.35, 11.2, 2.25), new THREE.Vector3(2.05, 10.8, 2.5));

  const sideVentL = addVent(torso, -4.6, 13.8, 2.4, 1.9, 6);
  const sideVentR = addVent(torso, 4.6, 13.8, 2.4, 1.9, 6);
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 6.4, 8), whiteStandard(WHITE_2));
  spine.position.set(0, 8.1, -0.1);
  addOutline(spine);
  torso.add(spine);
  addBolt(torso, -2.9, 16.6, 1.2, 0.18);
  addBolt(torso, 2.9, 16.6, 1.2, 0.18);
  addHydraulicRod(torso, -3.6, 10.2, -1.8, 4.4, false);
  addHydraulicRod(torso, 3.6, 10.2, -1.8, 4.4, false);
  addMotor(torso, -6.1, 11.1, -1.9);
  addMotor(torso, 6.1, 11.1, -1.9);
  addPanel(torso, -5.8, 15.0, 1.4, 2.4, 2.2, 1.0, WHITE_3);
  addPanel(torso, 5.8, 15.0, 1.4, 2.4, 2.2, 1.0, WHITE_3);
  torso.add(
    chest,
    upperChest,
    lowerChest,
    pecL,
    pecR,
    absL,
    absR,
    centerCore,
    reactorRingOuter,
    reactorRingInner,
    coreHeart,
    coreCasing,
    coreFrame,
    blackModuleL,
    blackModuleR,
    blackPodL,
    blackPodR,
    sternumEngine,
    auxEngineL,
    auxEngineR,
    chestGearCenter,
    chestGearL,
    chestGearR,
    chestGearUpper,
    chestGearLower,
    chestGearUL,
    chestGearUR,
    intakeTop,
    intakeLower,
    intakeLeft,
    intakeRight,
    chestRodUpper,
    chestRodLower,
    chestBraceL,
    chestBraceR,
    ribPlateTopL,
    ribPlateTopR,
    ribPlateMidL,
    ribPlateMidR,
    ribPlateLowL,
    ribPlateLowR,
    avionicsBoxL,
    avionicsBoxR,
    manifoldL,
    manifoldR,
    sideVentL,
    sideVentR,
    spine
  );
  torso.position.set(0, 0, 0);
  scene.add(torso);
  return { group: torso, core: centerCore };
}

function buildShoulder(scene: THREE.Scene, side: number) {
  const shoulder = new THREE.Group();
  const shell = addPanel(shoulder, side * 8.9, 16.4, 0, 7.2, 6.8, 2.2, WHITE);
  const shellInner = addPanel(shoulder, side * 8.9 + side * 0.7, 16.2, 0.8, 5.2, 5.0, 1.2, WHITE_2);
  const shellCap = addPanel(shoulder, side * 10.1, 17.4, 1.2, 2.8, 2.4, 0.9, WHITE_3);
  const deltoid = addMuscleShell(shoulder, side * 8.1, 14.8, 0.2, 1.1, 2.7, WHITE_2, side * 0.38);
  const pauldronFacet = addTriArmor(
    shoulder,
    side * 10.6,
    17.2,
    1.5,
    1.35,
    1.0,
    WHITE,
    new THREE.Euler(0.1, side * 0.3, side > 0 ? -1.5 : 1.5)
  );
  const joint = addGear(shoulder, side * 7.2, 13.7, 0.1, 1.45);
  const armMount = addPanel(shoulder, side * 6.5, 12.9, 0.2, 1.8, 1.6, 1.2, WHITE_3);
  const shoulderHorn = addPanel(shoulder, side * 11.5, 16.8, 0.7, 1.6, 2.4, 0.7, WHITE);
  shoulderHorn.rotation.z = side * 0.24;
  addHydraulicRod(shoulder, side * 9.7, 14.4, -1.2, 3.4, false);
  addHydraulicRod(shoulder, side * 8.1, 13.1, -1.2, 2.8, false);
  addVent(shoulder, side * 9.1, 17.2, 1.4, 2.0, 4);
  addBolt(shoulder, side * 8.8, 15.4, 0.9, 0.14);
  addBolt(shoulder, side * 6.9, 14.2, 1.0, 0.14);
  shoulder.add(shell, shellInner, shellCap, deltoid, pauldronFacet, joint, armMount, shoulderHorn);
  scene.add(shoulder);
  return { group: shoulder, joint };
}

function buildArm(scene: THREE.Scene, side: number) {
  const arm = new THREE.Group();
  const upper = addPanel(arm, side * 10.3, 10.3, 0.0, 3.4, 9.4, 1.5, WHITE_2);
  const upperMuscle = addMuscleShell(arm, side * 10.0, 10.1, 0.2, 1.0, 4.2, WHITE, side * 0.16);
  const bicepFacet = addPolyMuscle(arm, side * 11.2, 10.8, 0.8, 0.8, WHITE_3, new THREE.Vector3(0.9, 1.6, 0.7));
  const upperGuard = addPanel(arm, side * 11.1, 10.0, 0.9, 1.6, 6.6, 0.7, WHITE);
  const elbow = addGear(arm, side * 10.3, 5.4, 0.0, 1.15);
  const fore = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.85, 8.6, 10), whiteStandard(WHITE_3));
  fore.position.set(side * 10.3, 1.4, 0.0);
  fore.rotation.z = Math.PI / 2;
  addOutline(fore);
  arm.add(fore);

  const foreCone = new THREE.Mesh(new THREE.ConeGeometry(0.92, 3.2, 9), whiteStandard(WHITE));
  foreCone.position.set(side * 11.2, 0.2, 0.15);
  foreCone.rotation.z = side > 0 ? -Math.PI / 2 : Math.PI / 2;
  addOutline(foreCone);
  arm.add(foreCone);

  const forePoly = new THREE.Mesh(new THREE.DodecahedronGeometry(0.82), whiteStandard(WHITE_2));
  forePoly.position.set(side * 9.6, 2.2, 0.55);
  forePoly.scale.set(0.95, 1.3, 0.8);
  addOutline(forePoly);
  arm.add(forePoly);

  const foreMuscle = addMuscleShell(arm, side * 10.1, 1.5, 0.25, 0.86, 3.8, WHITE_2, side * 0.1);
  const foreFacet = addTriArmor(
    arm,
    side * 11.2,
    0.9,
    1.0,
    0.9,
    0.9,
    WHITE,
    new THREE.Euler(0, side * 0.2, side > 0 ? -1.45 : 1.45)
  );
  const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.74, 1.5, 9), whiteStandard(WHITE_2));
  wrist.position.set(side * 10.2, -3.4, 0.0);
  wrist.rotation.z = Math.PI / 2;
  addOutline(wrist);
  arm.add(wrist);
  const hand = buildHand(scene, side);
  addHydraulicRod(arm, side * 11.4, 7.2, -0.9, 3.6, false);
  addHydraulicRod(arm, side * 9.0, 7.4, -0.9, 3.6, false);
  addVent(arm, side * 10.3, 3.9, 1.0, 1.8, 4);
  addBolt(arm, side * 8.6, 8.8, 0.9, 0.12);
  addBolt(arm, side * 9.7, 1.3, 0.9, 0.12);
  addCableBundle(arm, new THREE.Vector3(side * 8.0, 14.5, -0.7), new THREE.Vector3(side * 9.3, 8.1, -1.0));
  if (side > 0) {
    addSpear(arm, side);
  }
  arm.add(upper, upperMuscle, bicepFacet, upperGuard, elbow, foreMuscle, foreFacet, wrist, hand);
  scene.add(arm);
  return { group: arm, elbow };
}

function buildLeg(scene: THREE.Scene, side: number) {
  const leg = new THREE.Group();
  const hip = addGear(leg, side * 4.6, -0.1, 0.0, 1.3);
  const thigh = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 1.65, 10.1, 10), whiteStandard(WHITE_2));
  thigh.position.set(side * 4.6, -5.9, 0.0);
  addOutline(thigh);
  leg.add(thigh);

  const thighMuscle = addMuscleShell(leg, side * 4.9, -5.9, 0.25, 1.35, 4.8, WHITE, side * 0.08);
  const thighOuterFrustum = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.05, 6.6, 9), whiteStandard(WHITE_3));
  thighOuterFrustum.position.set(side * 6.3, -6.0, 0.8);
  thighOuterFrustum.rotation.z = side * 0.16;
  addOutline(thighOuterFrustum);
  leg.add(thighOuterFrustum);

  const thighHemL = new THREE.Mesh(new THREE.SphereGeometry(1.35, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2), whiteStandard(WHITE));
  thighHemL.position.set(side * 5.2, -3.2, 0.9);
  thighHemL.rotation.x = Math.PI / 2;
  addOutline(thighHemL);
  leg.add(thighHemL);

  const thighPyramid = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.2, 4), whiteStandard(WHITE_3));
  thighPyramid.position.set(side * 5.9, -7.2, 1.4);
  thighPyramid.rotation.z = side > 0 ? -0.88 : 0.88;
  thighPyramid.rotation.x = Math.PI / 4;
  addOutline(thighPyramid);
  leg.add(thighPyramid);
  const quadFacet = addTriArmor(
    leg,
    side * 5.8,
    -6.1,
    1.25,
    1.2,
    1.1,
    WHITE_3,
    new THREE.Euler(0.1, side * 0.25, side > 0 ? -1.45 : 1.45)
  );
  const thighGuard = addPanel(leg, side * 6.1, -5.7, 1.1, 2.2, 8.2, 0.9, WHITE_3);
  const knee = addGear(leg, side * 4.6, -11.1, 0.0, 1.18);
  const shin = addPanel(leg, side * 4.6, -17.9, 0.0, 3.8, 11.2, 1.6, WHITE_3);
  const calfMuscle = addMuscleShell(leg, side * 4.7, -18.2, 0.1, 0.94, 4.8, WHITE_2, side * 0.06);
  const calfFacet = addPolyMuscle(leg, side * 5.9, -18.4, 0.9, 0.85, WHITE, new THREE.Vector3(0.8, 1.7, 0.7));
  const ankle = addGear(leg, side * 4.6, -24.2, 0.0, 1.0);
  const foot = addPanel(leg, side * 5.6, -26.5, 1.6, 5.8, 2.4, 3.2, WHITE);
  const heel = addPanel(leg, side * 3.5, -25.8, -0.8, 1.9, 2.6, 1.7, WHITE_2);
  const toe = addPanel(leg, side * 6.9, -26.4, 2.8, 1.8, 1.3, 1.7, WHITE_3);
  const calfThruster = addThruster(leg, side * 6.7, -20.7, -1.5, 0.7);
  calfThruster.rotation.y = side > 0 ? Math.PI : 0;
  addHydraulicRod(leg, side * 5.0, -8.0, -1.3, 3.3, false);
  addHydraulicRod(leg, side * 2.8, -8.0, -1.3, 3.3, false);
  addVent(leg, side * 3.8, -12.1, 1.3, 1.6, 4);
  addBolt(leg, side * 2.8, -17.1, 1.0, 0.12);
  addBolt(leg, side * 4.9, -17.1, 1.0, 0.12);
  addCableBundle(leg, new THREE.Vector3(side * 3.8, -1.0, -0.8), new THREE.Vector3(side * 3.8, -10.0, -0.6));
  leg.add(hip, thigh, thighMuscle, quadFacet, thighGuard, knee, shin, calfMuscle, calfFacet, ankle, foot, heel, toe, calfThruster);
  scene.add(leg);
  return { group: leg, knee, ankle };
}

function buildBackpack(scene: THREE.Scene) {
  const bag = new THREE.Group();
  const central = addPanel(bag, 0, 18.4, -2.5, 4.4, 5.5, 1.6, WHITE_2);
  const leftThruster = addThruster(bag, -3.6, 18.1, -3.0, 1.1);
  const rightThruster = addThruster(bag, 3.6, 18.1, -3.0, 1.1);
  const wingLeft = addPanel(bag, -8.7, 18.3, -1.8, 6.6, 1.2, 2.0, WHITE_3);
  const wingRight = addPanel(bag, 8.7, 18.3, -1.8, 6.6, 1.2, 2.0, WHITE_3);
  wingLeft.rotation.z = -0.34;
  wingRight.rotation.z = 0.34;
  wingLeft.rotation.y = -0.2;
  wingRight.rotation.y = 0.2;
  const podLeft = addThruster(bag, -10.9, 17.8, -2.8, 1.15);
  const podRight = addThruster(bag, 10.9, 17.8, -2.8, 1.15);
  podLeft.rotation.y = 0.1;
  podRight.rotation.y = -0.1;
  const podStabLeft = addPanel(bag, -12.2, 19.5, -1.5, 1.0, 3.2, 0.7, WHITE);
  const podStabRight = addPanel(bag, 12.2, 19.5, -1.5, 1.0, 3.2, 0.7, WHITE);
  podStabLeft.rotation.z = -0.45;
  podStabRight.rotation.z = 0.45;
  const topFin = addPanel(bag, 0, 22.0, -2.4, 3.4, 1.0, 0.7, WHITE_3);
  const pipeL = addMotor(bag, -1.9, 15.8, -2.4);
  const pipeR = addMotor(bag, 1.9, 15.8, -2.4);
  addGear(bag, 0, 16.5, -1.0, 0.75);
  addVent(bag, 0, 20.0, -1.4, 1.8, 4);
  addCableBundle(bag, new THREE.Vector3(-1.6, 18.0, -1.6), new THREE.Vector3(-4.1, 15.4, -2.3));
  addCableBundle(bag, new THREE.Vector3(1.6, 18.0, -1.6), new THREE.Vector3(4.1, 15.4, -2.3));
  bag.add(
    central,
    leftThruster,
    rightThruster,
    wingLeft,
    wingRight,
    podLeft,
    podRight,
    podStabLeft,
    podStabRight,
    topFin,
    pipeL,
    pipeR
  );
  scene.add(bag);
  return bag;
}

function buildHead(scene: THREE.Scene) {
  const head = new THREE.Group();
  const helmetCore = new THREE.Mesh(new THREE.SphereGeometry(2.85, 18, 14), whiteStandard(WHITE));
  helmetCore.scale.set(1.0, 1.18, 0.82);
  helmetCore.position.set(0, 25.6, 0.2);
  addOutline(helmetCore);
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.9, 2.4, 10), whiteStandard(WHITE_2));
  crown.position.set(0, 27.1, -0.2);
  crown.rotation.x = 0.2;
  addOutline(crown);
  const ovalGuard = new THREE.Mesh(new THREE.TorusGeometry(3.35, 0.22, 10, 30), whiteStandard(WHITE_2));
  ovalGuard.position.set(0, 24.8, 1.05);
  ovalGuard.rotation.x = 0.26;
  addOutline(ovalGuard);
  const cheekLeft = addTriArmor(head, -2.6, 24.2, 1.25, 1.0, 1.4, WHITE_2, new THREE.Euler(0, 0.16, 1.52));
  const cheekRight = addTriArmor(head, 2.6, 24.2, 1.25, 1.0, 1.4, WHITE_2, new THREE.Euler(0, -0.16, -1.52));
  const cheekWingL = addPanel(head, -3.45, 24.3, 0.8, 0.9, 1.8, 0.7, WHITE_3);
  const cheekWingR = addPanel(head, 3.45, 24.3, 0.8, 0.9, 1.8, 0.7, WHITE_3);
  cheekWingL.rotation.z = -0.34;
  cheekWingR.rotation.z = 0.34;
  const jawLeft = addPanel(head, -1.2, 22.9, 1.5, 0.9, 1.9, 0.9, WHITE_3);
  const jawRight = addPanel(head, 1.2, 22.9, 1.5, 0.9, 1.9, 0.9, WHITE_3);
  const face = addPanel(head, 0, 24.2, 1.8, 2.8, 3.2, 1.05, WHITE_2);
  const chin = addPanel(head, 0, 22.5, 1.9, 1.8, 1.2, 1.0, WHITE_3);
  const chinFacet = addPolyMuscle(head, 0, 22.2, 2.5, 0.55, WHITE, new THREE.Vector3(1.0, 0.7, 0.8));
  const noseGuard = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.15, 8), whiteStandard(WHITE_3));
  noseGuard.position.set(0, 23.9, 2.5);
  noseGuard.rotation.x = Math.PI / 2;
  addOutline(noseGuard);
  const eyeBar = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.35, 0.25), accentMaterial(BLUE));
  eyeBar.position.set(0, 24.8, 2.35);
  addOutline(eyeBar, OUTLINE);
  const vFinLeft = new THREE.Mesh(new THREE.BoxGeometry(0.38, 7.0, 0.35), whiteStandard(WHITE));
  const vFinRight = new THREE.Mesh(new THREE.BoxGeometry(0.38, 7.0, 0.35), whiteStandard(WHITE));
  vFinLeft.position.set(-1.0, 29.7, 0.7);
  vFinLeft.rotation.z = -0.62;
  vFinRight.position.set(1.0, 29.7, 0.7);
  vFinRight.rotation.z = 0.62;
  addOutline(vFinLeft); addOutline(vFinRight);
  const browLeft = addPanel(head, -2.0, 26.4, 1.4, 1.2, 0.9, 0.9, WHITE_3);
  const browRight = addPanel(head, 2.0, 26.4, 1.4, 1.2, 0.9, 0.9, WHITE_3);
  const templeL = addPanel(head, -3.2, 25.9, 0.3, 0.8, 2.2, 0.7, WHITE_2);
  const templeR = addPanel(head, 3.2, 25.9, 0.3, 0.8, 2.2, 0.7, WHITE_2);
  templeL.rotation.z = -0.24;
  templeR.rotation.z = 0.24;
  const sensorL = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), accentMaterial(BLUE));
  const sensorR = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), accentMaterial(BLUE));
  sensorL.position.set(-1.8, 25.1, 2.25);
  sensorR.position.set(1.8, 25.1, 2.25);
  const centerOptic = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.45, 10), accentMaterial(GOLD));
  centerOptic.rotation.x = Math.PI / 2;
  centerOptic.position.set(0, 24.9, 2.4);
  addOutline(sensorL); addOutline(sensorR);
  addOutline(centerOptic);
  addVent(head, -2.9, 23.0, 1.05, 1.2, 4);
  addVent(head, 2.9, 23.0, 1.05, 1.2, 4);
  head.add(
    helmetCore,
    crown,
    ovalGuard,
    cheekLeft,
    cheekRight,
    cheekWingL,
    cheekWingR,
    jawLeft,
    jawRight,
    face,
    chin,
    chinFacet,
    noseGuard,
    eyeBar,
    vFinLeft,
    vFinRight,
    browLeft,
    browRight,
    templeL,
    templeR,
    sensorL,
    sensorR,
    centerOptic
  );
  head.position.set(0, 2.4, 0);
  scene.add(head);
  return { group: head, eyeBar, centerOptic };
}

function buildRobot(scene: THREE.Scene) {
  const robot = new THREE.Group();
  const neck = buildNeck(scene);
  const waist = buildWaist(scene);
  const pelvis = buildPelvis(scene);
  const head = buildHead(scene);
  const torso = buildTorso(scene);
  const shoulders = [buildShoulder(scene, -1), buildShoulder(scene, 1)];
  const arms = [buildArm(scene, -1), buildArm(scene, 1)];
  const legs = [buildLeg(scene, -1), buildLeg(scene, 1)];
  const backpack = buildBackpack(scene);

  robot.add(neck, waist, pelvis, head.group, torso.group, backpack);
  robot.position.set(0, -2, 0);
  robot.rotation.y = -0.18;
  robot.scale.setScalar(1.14);
  scene.add(robot);

  return { robot, head, torso, shoulders, arms, legs, backpack };
}

function addBase(scene: THREE.Scene) {
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(20, 22, 1.2, 24),
    new THREE.MeshStandardMaterial({ color: 0xf0f1f3, metalness: 0.05, roughness: 0.85 })
  );
  base.position.set(0, -26.5, 0);
  addOutline(base, 0xadb5c0);
  scene.add(base);
}

export default function GundamInnerFrameCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fc);

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 4, 88);
    camera.lookAt(0, 8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(0xf8f9fc, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 2.0);
    const key = new THREE.DirectionalLight(0xffffff, 2.7);
    key.position.set(18, 40, 65);
    const fill = new THREE.DirectionalLight(0xcad6ea, 0.9);
    fill.position.set(-30, 10, 25);
    const rim = new THREE.DirectionalLight(0xfff8ec, 0.6);
    rim.position.set(0, 30, -50);
    scene.add(ambient, key, fill, rim);

    addBase(scene);
    const model = buildRobot(scene);

    animate(model.robot.position, {
      y: -1.5,
      duration: 2600,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    const idleRotation = { x: 0, y: -0.18, z: 0 };
    const targetRotation = { ...idleRotation };
    let isHovering = false;

    const setTargetFromPointer = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const normalizedX = (event.clientX - rect.left) / rect.width;
      const normalizedY = (event.clientY - rect.top) / rect.height;
      targetRotation.y = -0.5 + normalizedX * 1.0;
      targetRotation.x = 0.2 + (0.5 - normalizedY) * 0.42;
    };

    const onPointerEnter = (event: PointerEvent) => {
      isHovering = true;
      setTargetFromPointer(event);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isHovering) return;
      setTargetFromPointer(event);
    };

    const onPointerLeave = () => {
      isHovering = false;
      targetRotation.x = idleRotation.x;
      targetRotation.y = idleRotation.y;
      targetRotation.z = idleRotation.z;
    };

    mount.addEventListener("pointerenter", onPointerEnter);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerleave", onPointerLeave);

    animate(model.head.group.rotation, {
      z: 0.04,
      duration: 2200,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    animate(model.torso.core.scale, {
      x: 1.12,
      y: 1.12,
      z: 1.12,
      duration: 1600,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    animate(model.shoulders[0].group.rotation, {
      z: -0.08,
      duration: 1800,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    animate(model.shoulders[1].group.rotation, {
      z: 0.08,
      duration: 1800,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    animate(model.arms[0].group.rotation, {
      z: -0.2,
      duration: 2400,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    animate(model.arms[1].group.rotation, {
      z: 0.2,
      duration: 2400,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    animate(model.legs[0].group.rotation, {
      x: -0.08,
      duration: 2600,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    animate(model.legs[1].group.rotation, {
      x: 0.08,
      duration: 2600,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    animate(model.backpack.rotation, {
      y: 0.14,
      duration: 3400,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    animate(model.shoulders[0].joint.rotation, {
      y: 0.12,
      duration: 1900,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    animate(model.shoulders[1].joint.rotation, {
      y: -0.12,
      duration: 1900,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = performance.now() * 0.004;
      model.robot.rotation.x += (targetRotation.x - model.robot.rotation.x) * 0.06;
      model.robot.rotation.y += (targetRotation.y - model.robot.rotation.y) * 0.06;
      model.robot.rotation.z += (targetRotation.z - model.robot.rotation.z) * 0.06;
      model.robot.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.userData.isThrusterGlow && obj.material instanceof THREE.MeshBasicMaterial) {
          const pulse = 0.65 + Math.sin(t + obj.position.x * 0.8) * 0.25;
          obj.scale.setScalar(pulse);
          obj.material.opacity = 0.2 + pulse * 0.25;
        }
      });
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointerenter", onPointerEnter);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerleave", onPointerLeave);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />;
}
