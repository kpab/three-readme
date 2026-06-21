export interface FlipbookOptions {
  fps: number;
  width: number;
  height: number;
  background?: string;
}

function innerSvg(svg: string): string {
  const openingTagEnd = svg.indexOf(">");
  const closingTagStart = svg.lastIndexOf("</svg>");

  if (openingTagEnd === -1 || closingTagStart <= openingTagEnd) {
    throw new Error("Frame must be a complete SVG document");
  }

  return svg.slice(openingTagEnd + 1, closingTagStart);
}

function formatKeyTime(value: number): string {
  return value
    .toFixed(4)
    .replace(/(\.\d*?[1-9])0+$/, "$1")
    .replace(/\.0+$/, "");
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function encodeFlipbook(
  frames: string[],
  opts: FlipbookOptions,
): string {
  if (frames.length === 0) {
    throw new Error("At least one frame is required");
  }
  if (!Number.isFinite(opts.fps) || opts.fps <= 0) {
    throw new Error("fps must be a positive number");
  }

  const frameCount = frames.length;
  const duration = `${frameCount / opts.fps}s`;
  const keyTimes = Array.from({ length: frameCount + 1 }, (_, index) =>
    formatKeyTime(index / frameCount),
  ).join(";");
  const background = opts.background?.toLowerCase();
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.width}" height="${opts.height}" viewBox="${-opts.width / 2} ${-opts.height / 2} ${opts.width} ${opts.height}">`,
  ];

  if (opts.background && background !== "none" && background !== "transparent") {
    parts.push(
      `<rect x="${-opts.width / 2}" y="${-opts.height / 2}" width="${opts.width}" height="${opts.height}" fill="${escapeAttribute(opts.background)}"/>`,
    );
  }

  frames.forEach((frame, frameIndex) => {
    const values = Array.from({ length: frameCount + 1 }, (_, index) => {
      const loopedIndex = index === frameCount ? 0 : index;
      return loopedIndex === frameIndex ? "1" : "0";
    }).join(";");

    parts.push(
      `<g opacity="0"><animate attributeName="opacity" calcMode="discrete" repeatCount="indefinite" dur="${duration}" keyTimes="${keyTimes}" values="${values}"/>${innerSvg(frame)}</g>`,
    );
  });

  parts.push("</svg>");
  return parts.join("");
}
