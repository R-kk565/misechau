#!/usr/bin/env node
/**
 * 実写をフォルダごと取り込む。
 *   npm run photos -- hero
 *   npm run photos -- gallery
 *   npm run photos -- hero secret     （裏モード用に secret-001.jpg … で書き出す）
 *
 * EXIF の向きを画素に反映してから EXIF を落とす
 * （スマホ写真が横倒しになるのと、位置情報が残ったまま公開されるのを防ぐ）。
 * 長辺を縮小し、連番で書き出す。並び順はファイル名順。
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const KINDS = new Set(["hero", "gallery"]);
const LONG_EDGE = { hero: 2400, gallery: 1600 };
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".avif", ".tif", ".tiff"]);

const [kind, variant] = process.argv.slice(2);

if (!KINDS.has(kind)) {
  console.error("使い方: npm run photos -- hero|gallery [secret]");
  process.exit(1);
}

const prefix = variant === "secret" ? "secret-" : "";
const srcDir = path.join(process.cwd(), "assets-src", kind);
const outDir = path.join(process.cwd(), "public", "photos", kind);

const entries = (await readdir(srcDir, { withFileTypes: true }))
  .filter((e) => e.isFile() && EXTENSIONS.has(path.extname(e.name).toLowerCase()))
  .map((e) => e.name)
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

if (entries.length === 0) {
  console.error(`${srcDir} に画像がありません。`);
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

let n = 0;
for (const name of entries) {
  n += 1;
  const outName = `${prefix}${String(n).padStart(3, "0")}.jpg`;
  const buffer = await sharp(path.join(srcDir, name))
    // rotate() を引数なしで呼ぶと EXIF の向きが画素に反映される。
    .rotate()
    .resize({
      width: LONG_EDGE[kind],
      height: LONG_EDGE[kind],
      fit: "inside",
      withoutEnlargement: true,
    })
    // sharp は既定でメタデータを落とす（＝ EXIF も位置情報も残らない）。
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  await writeFile(path.join(outDir, outName), buffer);
  console.log(`${name} -> photos/${kind}/${outName}`);
}

console.log(`\n${n} 枚。lib/site-content.ts のパスと枚数を確認すること。`);
