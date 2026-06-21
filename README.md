# three-readme

A CLI / GitHub Action that bakes Three.js scenes into animated SVGs (SMIL) for embedding in your README. Like platane/snk, it commits the generated artifacts back into the repository.

## Demo

<p>
  <img width="32%" alt="torusknot" src="./assets/torusknot.svg?v=56e0acf3">
  <img width="32%" alt="icosahedron" src="./assets/icosahedron.svg?v=c242b575">
  <img width="32%" alt="torus" src="./assets/torus.svg?v=cba3d85c">
</p>

The `assets/*.svg` files don't exist until the GitHub Action runs for the first time. The `?v=<hash>` query is for camo cache-busting and is maintained automatically — the workflow rewrites it to the SVG's content hash, so it changes only when the image changes (see [Embedding in a README](#embedding-in-a-readme)).

## How it works

jsdom injects a DOM into the Node.js environment.
Three's `SVGRenderer` converts each frame into SVG.
N frames are encoded into a single SVG using one-hot opacity SMIL `<animate>` elements.
Finally, SVGO optimizes the result conservatively.

## CLI usage

```bash
npm run render -- --scene torusknot --frames 24 --bg "#0d1117" --color "#39d353" --out assets/torusknot.svg
```

| Flag | Default | Description |
| --- | --- | --- |
| `--scene` | `torusknot` | Scene name to render (`torusknot` / `icosahedron` / `torus`) |
| `--frames` | `24` | Number of frames (positive integer) |
| `--fps` | `12` | Frames per second |
| `--width` | `480` | SVG width |
| `--height` | `480` | SVG height |
| `--color` | `#ffffff` | Drawing color passed to the scene |
| `--bg` | `none` | Background color. `none` for transparent |
| `--out` | `out/<scene>.svg` | Output path |

Unknown `--key value` flags are passed to the scene as `params`. `--color` is also consumed by the scene via `params`.

## Adding a scene

1. Create `src/scenes/<name>.ts` and implement a `SceneFactory` (`(params, ctx) => { scene, camera, update(frame, frameCount) }`) as a named export (not a default export). `ctx` is `{ THREE, width, height }`. Use `params.color` for the color.
2. Import the scene in `src/scenes/index.ts` and register it in `sceneRegistry`.
3. Generate and verify with `npm run render -- --scene <name> --out assets/<name>.svg`.

`src/scenes/torusknot.ts` / `src/scenes/icosahedron.ts` / `src/scenes/torus.ts` are reference implementations.

## GitHub Action

`.github/workflows/render.yml` regenerates the SVGs and auto-commits them to `assets/` — triggered manually, on a weekly schedule (every Monday), or on pushes to `main` that touch `src` and similar paths.

To use it in your own repository:

1. Copy `.github/workflows/render.yml`.
2. Edit the CLI `--scene`, color, frame count, output path, etc.
3. Set `permissions: contents: write` in the workflow to grant Actions commit access.

## Embedding in a README

Use a relative path with a cache-busting query.

```markdown
![](./assets/torusknot.svg?v=1)
```

GitHub serves SVGs through its camo proxy with aggressive caching. The `render` workflow runs `npm run update-readme` after rendering, which rewrites the `?v=` token on each demo `<img>` to a hash of the SVG's bytes — so the cache is busted exactly when (and only when) the image changes, with no manual bumping. The literal `?v=1` above is just a placeholder for the example.

## Constraints

- Animation is SMIL only. No CSS `<style>` or `@keyframes`.
- Aim for around 12 fps and within a few hundred KB.
