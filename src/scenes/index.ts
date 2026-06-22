import type { SceneFactory } from "../scene.js";
import { crystal } from "./crystal.js";
import { icosahedron } from "./icosahedron.js";
import { teapot } from "./teapot.js";
import { text } from "./text.js";
import { torus } from "./torus.js";
import { torusknot } from "./torusknot.js";

export const sceneRegistry: Record<string, SceneFactory> = {
  torusknot,
  icosahedron,
  torus,
  teapot,
  crystal,
  text,
};
