import { TeapotGeometry } from "three/addons/geometries/TeapotGeometry.js";

import type { SceneFactory } from "../scene.js";

export const teapot: SceneFactory = (params, ctx) => {
  const { THREE, width, height } = ctx;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.set(0, 1.5, 9);
  camera.lookAt(0, 0, 0);

  const geometry = new TeapotGeometry(2, 2);
  const color = typeof params.color === "string" ? params.color : "#ffffff";
  const material = new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    metalness: 0.1,
    roughness: 0.7,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
  directionalLight.position.set(3, 5, 4);
  scene.add(ambientLight, directionalLight);

  return {
    scene,
    camera,
    update(frame, frameCount) {
      const t = frame / frameCount;
      mesh.rotation.y = t * Math.PI * 2;
    },
  };
};
