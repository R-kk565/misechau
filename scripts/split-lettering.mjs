#!/usr/bin/env node
/**
 * 見出しの筆文字が 1 枚の画像にまとまっている場合に、
 * 白地を透明に抜いて語ごとに切り分ける。
 *   npm run lettering
 *   npm run lettering -- official-site profile gallery links contact
 *
 * 出力は public/lettering/<名前>.png。
 * 書き出したら lib/site-content.ts の LETTERING にパスを入れる。
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"]);
const names = process.argv.slice(2);

const srcDir = path.join(process.cwd(), "assets-src", "lettering");
const outDir = path.join(process.cwd(), "public", "lettering");

const files = (await readdir(srcDir, { withFileTypes: true }))
  .filter((e) => e.isFile() && EXTENSIONS.has(path.extname(e.name).toLowerCase()))
  .map((e) => e.name)
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

if (files.length === 0) {
  console.error(`${srcDir} に画像がありません。`);
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const INK_THRESHOLD = 0.82; // これより明るい画素は地色とみなす
const MIN_WORD_WIDTH = 12;
const GAP_RATIO = 0.02; // 画像幅に対する語間の最小空き

let produced = 0;

for (const file of files) {
  const image = sharp(path.join(srcDir, file)).rotate();
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // 白地を透明に抜く: 暗いほど不透明。インクは currentColor で塗るので黒のまま残す。
  const rgba = Buffer.alloc(width * height * 4);
  const columnHasInk = new Uint8Array(width);
  const inkMask = new Uint8Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const srcAlpha = channels === 4 ? data[i + 3] / 255 : 1;
      const luminance = Math.min(1, (r + g + b) / 3);
      const ink = Math.max(0, 1 - luminance / INK_THRESHOLD) * srcAlpha;
      const o = (y * width + x) * 4;
      rgba[o] = 0;
      rgba[o + 1] = 0;
      rgba[o + 2] = 0;
      rgba[o + 3] = Math.round(Math.min(1, ink) * 255);
      if (ink > 0.35) {
        columnHasInk[x] = 1;
        inkMask[y * width + x] = 1;
      }
    }
  }

  // 語の切れ目（一定幅以上の空き列）で分割する。
  const minGap = Math.max(6, Math.round(width * GAP_RATIO));
  const segments = [];
  let start = -1;
  let gap = 0;
  for (let x = 0; x < width; x += 1) {
    if (columnHasInk[x]) {
      if (start < 0) start = x;
      gap = 0;
    } else if (start >= 0) {
      gap += 1;
      if (gap >= minGap) {
        segments.push([start, x - gap]);
        start = -1;
        gap = 0;
      }
    }
  }
  if (start >= 0) segments.push([start, width - 1]);

  const words = segments.filter(([a, b]) => b - a + 1 >= MIN_WORD_WIDTH);
  if (words.length === 0) {
    console.warn(`${file}: インクが見つかりませんでした。`);
    continue;
  }

  for (let i = 0; i < words.length; i += 1) {
    const [a, b] = words[i];
    const pad = Math.round(width * 0.004);
    const left = Math.max(0, a - pad);
    const right = Math.min(width - 1, b + pad);
    const name = names[produced] ?? `${path.parse(file).name}-${String(i + 1).padStart(2, "0")}`;
    // 上下の余白も落とす（trim() は透明背景だと全面を削ってしまうので自前で範囲を求める）。
    let top = height;
    let bottom = -1;
    for (let y = 0; y < height; y += 1) {
      for (let x = a; x <= b; x += 1) {
        if (inkMask[y * width + x]) {
          if (y < top) top = y;
          if (y > bottom) bottom = y;
          break;
        }
      }
    }
    const padY = Math.round(height * 0.02);
    top = Math.max(0, top - padY);
    bottom = Math.min(height - 1, bottom + padY);

    const out = await sharp(rgba, { raw: { width, height, channels: 4 } })
      .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await writeFile(path.join(outDir, `${name}.png`), out);
    console.log(`${file} [${i + 1}/${words.length}] -> lettering/${name}.png`);
    produced += 1;
  }
}

console.log("\n書き出したら lib/site-content.ts の LETTERING にパスを入れること。");
