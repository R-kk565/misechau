#!/usr/bin/env node
/**
 * プロフィール写真 1 枚を同じ要領で整える。
 *   npm run portrait              （assets-src/portrait の 1 枚目 -> public.jpg）
 *   npm run portrait -- secret    （-> secret.jpg）
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".avif", ".tif", ".tiff"]);
const variant = process.argv[2] === "secret" ? "secret" : "public";

const srcDir = path.join(process.cwd(), "assets-src", "portrait");
const outDir = path.join(process.cwd(), "public", "photos", "portrait");

const files = (await readdir(srcDir, { withFileTypes: true }))
  .filter((e) => e.isFile() && EXTENSIONS.has(path.extname(e.name).toLowerCase()))
  .map((e) => e.name)
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

const source = files.find((name) => name.toLowerCase().startsWith(variant)) ?? files[0];
if (!source) {
  console.error(`${srcDir} に画像がありません。`);
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const buffer = await sharp(path.join(srcDir, source))
  .rotate()
  .resize({ width: 1200, height: 1600, fit: "inside", withoutEnlargement: true })
  .jpeg({ quality: 90, mozjpeg: true })
  .toBuffer();

await writeFile(path.join(outDir, `${variant}.jpg`), buffer);
console.log(`${source} -> photos/portrait/${variant}.jpg`);
