import { optimize } from "svgo";

export function optimizeSvg(svg: string): string {
  return optimize(svg, {
    plugins: [
      "removeComments",
      "removeMetadata",
      "removeXMLProcInst",
      "cleanupAttrs",
      { name: "cleanupNumericValues", params: { floatPrecision: 1 } },
      { name: "convertPathData", params: { floatPrecision: 1 } },
    ],
  }).data;
}
