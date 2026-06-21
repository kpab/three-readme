import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const readmePath = path.resolve(root, "README.md");
const readme = readFileSync(readmePath, "utf8");
const imagePattern = /(<img\b[^>]*\bsrc=")(.\/assets\/[^"?]+\.svg)(\?v=[^"]*)?(")/g;
const updates: Array<{ asset: string; token: string }> = [];

const updatedReadme = readme.replace(imagePattern, (match, prefix, asset, _token, quote) => {
  const assetPath = path.resolve(root, asset.slice(2));

  try {
    const bytes = readFileSync(assetPath);
    const token = `?v=${createHash("sha256").update(bytes).digest("hex").slice(0, 8)}`;
    const replacement = `${prefix}${asset}${token}${quote}`;

    if (replacement !== match) {
      updates.push({ asset, token });
    }

    return replacement;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return match;
    }

    throw error;
  }
});

if (updatedReadme !== readme) {
  writeFileSync(readmePath, updatedReadme, "utf8");
  for (const { asset, token } of updates) {
    console.log(`${path.basename(asset)} ${token}`);
  }
}
