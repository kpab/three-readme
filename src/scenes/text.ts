import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

import type { SceneFactory } from "../scene.js";

const require = createRequire(import.meta.url);
const fontPath = require.resolve(
  "three/examples/fonts/helvetiker_bold.typeface.json",
);
const fontJson = JSON.parse(readFileSync(fontPath, "utf8"));
const font = new FontLoader().parse(fontJson);

export const text: SceneFactory = (params, ctx) => {
  const { THREE, width, height } = ctx;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.set(0, 0, 6);
  camera.lookAt(0, 0, 0);

  const value = typeof params.text === "string" ? params.text : "STAR";
  const geometry = new TextGeometry(value, {
    font,
    size: 1.5,
    depth: 0.5,
    curveSegments: 3,
    bevelEnabled: false,
  });
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox;
  if (boundingBox) {
    const centerX = (boundingBox.min.x + boundingBox.max.x) / 2;
    const centerY = (boundingBox.min.y + boundingBox.max.y) / 2;
    const centerZ = (boundingBox.min.z + boundingBox.max.z) / 2;
    geometry.translate(-centerX, -centerY, -centerZ);
  }

  const color = typeof params.color === "string" ? params.color : "#ffffff";
  const material = new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    metalness: 0.1,
    roughness: 0.6,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(3, 5, 4);
  scene.add(ambientLight, directionalLight);

  return {
    scene,
    camera,
    update(frame, frameCount) {
      const t = frame / frameCount;
      mesh.rotation.y = Math.sin(t * Math.PI * 2) * 0.6;
    },
  };
};
