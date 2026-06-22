import type { SceneFactory } from "../scene.js";

export const crystal: SceneFactory = (params, ctx) => {
  const { THREE, width, height } = ctx;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.set(0, 0, 6);
  camera.lookAt(0, 0, 0);

  const geometry = new THREE.IcosahedronGeometry(1.7, 0);
  const color = typeof params.color === "string" ? params.color : "#ffffff";
  const material = new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    metalness: 0.35,
    roughness: 0.35,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(4, 5, 3);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(-4, -2, -3);
  scene.add(ambientLight, keyLight, fillLight);

  return {
    scene,
    camera,
    update(frame, frameCount) {
      const t = frame / frameCount;
      mesh.rotation.y = t * Math.PI * 2;
      mesh.rotation.x = Math.sin(t * Math.PI * 2) * 0.15;
    },
  };
};
