# OFFICIAL SITE

タレントの公式サイト。写真と筆文字は後から差し替える前提で、構造と演出を先に組んである。

## 技術構成

Next.js 16（App Router）+ TypeScript + Tailwind CSS v4。
共通コンポーネントは `components/ui/`、`cn` は `lib/utils.ts`（shadcn 準拠）。
スクロール連動は GSAP（ScrollTrigger）、出入りの切り替えは framer-motion。
`src/` は使わず `app/` `components/` `lib/` をリポジトリ直下に置いている。

## 差し替えは 1 ファイルだけ

文言・写真パス・切り取り位置はすべて **`lib/site-content.ts`** に集約してある。
ページやコンポーネントを触らずに差し替えられる。

- 未確定の項目には架空の値を入れない。空欄は `EMPTY`（`"—"`）のままにする。
  表示は「—」、リンクは非活性になる。該当箇所に `TODO:` コメントを付けてある。
- `SECRET_MODE_ENABLED` は既定で `false`。写真が揃うまで表モードだけで公開できる。
  `false` のあいだはプロフィールカードはスイッチにならず、表/裏の印も出ない。
  保存済みの設定が残っていても必ず表モードで始まる。裏モードの文言・写真はそのまま残る。

## 開発

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm run lint
```

## 素材の取り込み

実素材は `assets-src/` に置いて（git 管理外）、スクリプトで `public/` に書き出す。
EXIF の向きを画素に反映してから EXIF を落とすので、横倒しにならず位置情報も残らない。

```bash
npm run photos -- hero            # assets-src/hero   -> public/photos/hero/001.jpg …
npm run photos -- gallery         # assets-src/gallery -> public/photos/gallery/001.jpg …
npm run photos -- hero secret     # 裏モード用（secret-001.jpg …）
npm run portrait                  # assets-src/portrait -> public/photos/portrait/public.jpg
npm run portrait -- secret        #                     -> secret.jpg
npm run lettering -- official-site profile gallery links contact
                                  # 筆文字 1 枚を白地を抜いて語ごとに切り分ける
npm run placeholders              # 差し替え前の仮写真を作り直す
```

書き出したら `lib/site-content.ts` の写真パス・枚数、`LETTERING` のパスを合わせる。

- 実写を入れたら **PC とスマホの両方で顔が切れていないか必ず見る**。
  PC（横長）は縦が、スマホ（縦長）は横が切られる。軸が重ならないので
  `objectPosition` 1 つで両方を賄える。
- 切り取り位置は数値計算だけで決めない。候補を何パターンか切り出して並べ、目で見て選ぶ。

## 限定公開ゲート

環境変数 `SITE_ACCESS_PASSWORD` を設定すると、パスワード保護が有効になる。

- HMAC-SHA256 で署名したトークンを HttpOnly Cookie に 7 日間保存する。
- 画像への直リンク（`/photos/*`、`/_next/image`）も `proxy.ts` で保護する。
- 未設定のときはゲートを無効（ローカル開発・CI で閉め出されないように）。

Next.js 16 では `middleware.ts` は `proxy.ts` にリネームされている（機能は同じ、既定は Node.js ランタイム）。

## 既知の落とし穴（触る前に）

- `overflow-x: hidden` を html/body に使わない。スクロールコンテナが生まれて
  ファーストビューの `position: sticky` が効かなくなる。`overflow-x: clip` を使う。
- 拡大縮小に CSS の `zoom` を使わない（当たり判定がずれる）。`transform: scale` ＋負のマージン。
- Tailwind v4 の `-translate-y-*` は `transform` ではなく `translate` プロパティを動かす。
  トランジションの対象を `translate` にすること。
- マーキーの間隔は `gap` ではなく `padding-right` で持たせる（`gap` だと 1 周ごとにずれる）。
- マーキーの写真は遅延読み込みにしない（画面外から流れてくるので空のカードが現れる）。
- GSAP で `svh` を直接トゥイーンしない。CSS 変数を 0→1 で動かし `calc()` 側で組み立てる。
- 効果（useEffect）の中で setState を直接呼ばない。localStorage 由来のモードや
  `matchMedia` は `useSyncExternalStore` で外部ストアとして扱う（`lib/mode.ts`）。
- 配色の反転に `filter: invert()` を使わない（写真まで反転する）。
  CSS 変数を `:root[data-mode='secret']` で差し替える。
- 確認は実ブラウザで行う。dev サーバーを使い回すと古い chunk を配り続けることがある。
