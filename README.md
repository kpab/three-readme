# three-readme

A CLI / GitHub Action that bakes Three.js scenes into animated SVGs (SMIL) for embedding in your README. Like platane/snk, it commits the generated artifacts back into the repository.

**[→ Live gallery](https://kpab.github.io/three-readme/)** — see every scene animating, plus a copy-paste quickstart.

## Demo

<p align="center">
  <img width="50%" alt="crystal" src="./assets/crystal.svg?v=9d50f6b2">
</p>

<p align="center">
  <img width="19%" alt="text" src="./assets/text.svg?v=dbfa3662">
  <img width="19%" alt="torusknot" src="./assets/torusknot.svg?v=a1d2572e">
  <img width="19%" alt="icosahedron" src="./assets/icosahedron.svg?v=b2a25109">
  <img width="19%" alt="torus" src="./assets/torus.svg?v=29ff204a">
  <img width="19%" alt="teapot" src="./assets/teapot.svg?v=c4eec480">
</p>

These demos are rendered with a transparent background (`--bg none`), so they sit cleanly on both light and dark GitHub themes — no `<picture>` swap needed.

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
| `--scene` | `torusknot` | Scene name to render (`crystal` / `text` / `torusknot` / `icosahedron` / `torus` / `teapot`) |
| `--frames` | `24` | Number of frames (positive integer) |
| `--fps` | `12` | Frames per second |
| `--width` | `480` | SVG width |
| `--height` | `480` | SVG height |
| `--color` | `#ffffff` | Drawing color passed to the scene |
| `--bg` | `none` | Background color. `none` for transparent |
| `--out` | `out/<scene>.svg` | Output path |

Unknown `--key value` flags are passed to the scene as `params`. `--color` is also consumed by the scene via `params`. For example, the `text` scene reads `--text` to render arbitrary 3D text:

```bash
npm run render -- --scene text --text "YOUR NAME" --color "#39d353" --out assets/text.svg
```

## Adding a scene

1. Create `src/scenes/<name>.ts` and implement a `SceneFactory` (`(params, ctx) => { scene, camera, update(frame, frameCount) }`) as a named export (not a default export). `ctx` is `{ THREE, width, height }`. Use `params.color` for the color.
2. Import the scene in `src/scenes/index.ts` and register it in `sceneRegistry`.
3. Generate and verify with `npm run render -- --scene <name> --out assets/<name>.svg`.

`src/scenes/crystal.ts` (shaded low-poly hero), `src/scenes/text.ts` (3D text from a bundled font), `src/scenes/torusknot.ts`, `src/scenes/icosahedron.ts`, `src/scenes/torus.ts`, and `src/scenes/teapot.ts` are reference implementations.

## GitHub Action

### Use it as a reusable Action (recommended)

Add a few lines to a workflow in your own repository — no need to copy this repo or install Three.js yourself. The Action renders the scene into your workspace; commit the result with any auto-commit step.

```yaml
name: readme-art

on:
  workflow_dispatch:
  schedule:
    - cron: "17 3 * * 1" # weekly

permissions:
  contents: write

jobs:
  render:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: kpab/three-readme@v1
        with:
          scene: torusknot
          color: "#39d353"
          bg: "#0d1117"
          out: assets/torusknot.svg

      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: update readme art"
          file_pattern: "assets/*.svg"
```

| Input | Default | Description |
| --- | --- | --- |
| `scene` | `torusknot` | Scene name (`crystal` / `text` / `torusknot` / `icosahedron` / `torus` / `teapot`) |
| `frames` | `24` | Number of frames |
| `fps` | `12` | Frames per second |
| `width` | `480` | SVG width |
| `height` | `480` | SVG height |
| `color` | `#ffffff` | Drawing color |
| `bg` | `none` | Background color (`none` for transparent) |
| `out` | _(required)_ | Output path, relative to your repo |
| `node-version` | `20` | Node.js version used to run the renderer |

### Copy the full workflow (this repo)

`.github/workflows/render.yml` is how this repo renders its own demos: it regenerates the SVGs and auto-commits them to `assets/` — triggered manually, on a weekly schedule (every Monday), or on pushes to `main` that touch `src` and similar paths. Use it as a worked example if you'd rather vendor the renderer than reference the Action.

## Embedding in a README

Use a relative path with a cache-busting query.

```markdown
![](./assets/torusknot.svg?v=1)
```

GitHub serves SVGs through its camo proxy with aggressive caching. The `render` workflow runs `npm run update-readme` after rendering, which rewrites the `?v=` token on each demo `<img>` to a hash of the SVG's bytes — so the cache is busted exactly when (and only when) the image changes, with no manual bumping. The literal `?v=1` above is just a placeholder for the example.

## Constraints

- Animation is SMIL only. No CSS `<style>` or `@keyframes`.
- Aim for around 12 fps and within a few hundred KB.

## License

[MIT](./LICENSE)
