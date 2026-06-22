import type { SceneFactory } from "../scene.js";
import { icosahedron } from "./icosahedron.js";
import { teapot } from "./teapot.js";
import { torus } from "./torus.js";
import { torusknot } from "./torusknot.js";

export const sceneRegistry: Record<string, SceneFactory> = {
  torusknot,
  icosahedron,
  torus,
  teapot,
};
