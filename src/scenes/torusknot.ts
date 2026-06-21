import type { SceneFactory } from "../scene.js";

export const torusknot: SceneFactory = (params, ctx) => {
  const { THREE, width, height } = ctx;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.z = 8;

  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 32, 5, 2, 3);
  const color = typeof params.color === "string" ? params.color : "#ffffff";
  const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return {
    scene,
    camera,
    update(frame, frameCount) {
      const t = frame / frameCount;
      mesh.rotation.y = t * Math.PI * 2;
      mesh.rotation.x = t * Math.PI * 2;
    },
  };
};
