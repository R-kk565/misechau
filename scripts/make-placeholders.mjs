#!/usr/bin/env node
/**
 * 差し替え前の仮写真を作る（実素材が来たら npm run photos / portrait で上書きされる）。
 *   npm run placeholders
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

const palettes = [
  ["#dcd7d0", "#b5aca3"],
  ["#d5d9dc", "#a9b1b8"],
  ["#e0d6d9", "#b7a3ab"],
  ["#d3dad3", "#a6b1a4"],
  ["#ddd8cc", "#b0a68f"],
];

function svg(width, height, label, index) {
  const [a, b] = palettes[index % palettes.length];
  const cx = width / 2;
  const cy = height * 0.32;
  const r = Math.min(width, height) * 0.16;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
  </linearGradient></defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#00000018"/>
  <rect x="${cx - r * 1.5}" y="${cy + r * 1.15}" width="${r * 3}" height="${r * 2.2}" rx="${r * 0.6}" fill="#00000012"/>
  <text x="${cx}" y="${height - height * 0.06}" font-family="Helvetica, Arial, sans-serif"
    font-size="${Math.round(Math.min(width, height) * 0.05)}" letter-spacing="6"
    fill="#00000055" text-anchor="middle">${label}</text>
</svg>`);
}

async function write(file, width, height, label, index) {
  await mkdir(path.dirname(file), { recursive: true });
  const buffer = await sharp(svg(width, height, label, index)).jpeg({ quality: 82 }).toBuffer();
  await writeFile(file, buffer);
}

const jobs = [];

// ファーストビュー（表）: 縦長と横長を混ぜて、切り取り位置の確認ができるようにする。
const heroSizes = [
  [1600, 2400],
  [2400, 1600],
  [1800, 2400],
  [2400, 1800],
];
heroSizes.forEach(([w, h], i) => {
  jobs.push(
    write(
      path.join(root, "public/photos/hero", `${String(i + 1).padStart(3, "0")}.jpg`),
      w,
      h,
      `HERO ${String(i + 1).padStart(3, "0")}`,
      i,
    ),
  );
});

// ファーストビュー（裏）: 顔と胸が全部映るか確認するための縦長。
for (let i = 0; i < 3; i += 1) {
  jobs.push(
    write(
      path.join(root, "public/photos/hero", `secret-${String(i + 1).padStart(3, "0")}.jpg`),
      1200,
      1800,
      `SECRET ${String(i + 1).padStart(3, "0")}`,
      i + 2,
    ),
  );
}

for (let i = 0; i < 10; i += 1) {
  jobs.push(
    write(
      path.join(root, "public/photos/gallery", `${String(i + 1).padStart(3, "0")}.jpg`),
      800,
      i % 3 === 0 ? 1200 : 1067,
      String(i + 1).padStart(3, "0"),
      i,
    ),
  );
}

for (let i = 0; i < 8; i += 1) {
  jobs.push(
    write(
      path.join(root, "public/photos/gallery", `secret-${String(i + 1).padStart(3, "0")}.jpg`),
      800,
      i % 2 === 0 ? 1100 : 1000,
      `S ${String(i + 1).padStart(3, "0")}`,
      i + 1,
    ),
  );
}

jobs.push(write(path.join(root, "public/photos/portrait/public.jpg"), 900, 1200, "PORTRAIT", 0));
jobs.push(write(path.join(root, "public/photos/portrait/secret.jpg"), 900, 1200, "PORTRAIT S", 3));

await Promise.all(jobs);
console.log(`${jobs.length} 枚の仮写真を書き出しました。`);
