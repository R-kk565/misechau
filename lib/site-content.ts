/**
 * このサイトの文言・写真パス・切り取り位置はすべてこのファイルに集約する。
 * ページやコンポーネントを触らずに差し替えられること。
 *
 * 未確定の項目には架空の値を入れない。空欄は EMPTY のまま置き、
 * 表示は「—」、リンクは非活性になる。
 */

/** 未確定を表す値。表示は「—」、リンクなら非活性になる。 */
export const EMPTY = "—" as const;

export type Empty = typeof EMPTY;

export function isEmpty(value: string | null | undefined): boolean {
  return !value || value === EMPTY;
}

/**
 * 裏モードの有効・無効。
 * 既定は false（写真が揃うまで表モードだけで公開できるようにするため）。
 * false のときは表モードだけのサイトとして振る舞い、
 * プロフィールカードはスイッチにならず、表/裏の印も出ない。
 * 保存済みの設定が残っていても必ず表モードで始まる。
 */
export const SECRET_MODE_ENABLED = false;

export type Mode = "public" | "secret";

export type Photo = {
  src: string;
  alt: string;
  /**
   * 切り取り位置（CSS の object-position）。
   * 構図の違う写真が混ざると一律の位置では顔が切れるため、写真ごとに指定する。
   * PC（横長）は縦が、スマホ（縦長）は横が切られる。両方で顔が切れないか必ず確認すること。
   * 裏モードのファーストビューは全体表示（contain）なので、この指定は打ち消される。
   */
  objectPosition?: string;
};

export type ProfileItem = { label: string; value: string };

export type ProfileContent = {
  name: string;
  reading: string;
  photo: Photo;
  items: ProfileItem[];
};

export type LinkId = "instagram" | "x" | "youtube" | "tiktok" | "line";

export type LinkEntry = {
  id: LinkId;
  label: string;
  /** 未確定のあいだは EMPTY のままにする。非活性で表示される。 */
  href: string;
};

export type ModeContent = {
  hero: Photo[];
  profile: ProfileContent;
  gallery: Photo[];
  /** 表示するリンク。モードごとに出し分ける。 */
  links: LinkEntry[];
};

/**
 * 見出しの筆文字。パスを入れると筆文字画像に差し替わる。null なら文字組み。
 * 画像は <img> で貼らずに CSS のマスクとして敷き currentColor で塗るので、
 * 黒い素材のままでも表／裏どちらの配色でも見える。
 * `npm run lettering` で 1 枚の筆文字画像から語ごとに切り出せる。
 */
export type LetteringKey =
  | "officialSite"
  | "profile"
  | "gallery"
  | "links"
  | "contact";

// TODO: 筆文字素材が用意できたら "/lettering/profile.png" のようにパスを入れる。
export const LETTERING: Record<LetteringKey, string | null> = {
  officialSite: null,
  profile: null,
  gallery: null,
  links: null,
  contact: null,
};

/** 見出しの文字組みフォールバック（筆文字が null のときに使われる）。 */
export const HEADING_TEXT: Record<LetteringKey, string> = {
  officialSite: "OFFICIAL SITE",
  profile: "PROFILE",
  gallery: "GALLERY",
  links: "LINKS",
  contact: "CONTACT",
};

export const NAV_ITEMS = [
  { id: "profile", label: "PROFILE" },
  { id: "gallery", label: "GALLERY" },
  { id: "links", label: "LINKS" },
  { id: "contact", label: "CONTACT" },
] as const;

// 写真は差し替え前の仮素材。`npm run photos -- hero` / `-- gallery` で入れ替える。
const heroPublic: Photo[] = [
  { src: "/photos/hero/001.jpg", alt: "", objectPosition: "50% 30%" },
  { src: "/photos/hero/002.jpg", alt: "", objectPosition: "50% 25%" },
  { src: "/photos/hero/003.jpg", alt: "", objectPosition: "50% 35%" },
  { src: "/photos/hero/004.jpg", alt: "", objectPosition: "50% 30%" },
];

const heroSecret: Photo[] = [
  { src: "/photos/hero/secret-001.jpg", alt: "" },
  { src: "/photos/hero/secret-002.jpg", alt: "" },
  { src: "/photos/hero/secret-003.jpg", alt: "" },
];

const galleryPublic: Photo[] = Array.from({ length: 10 }, (_, i) => ({
  src: `/photos/gallery/${String(i + 1).padStart(3, "0")}.jpg`,
  alt: "",
  objectPosition: "50% 35%",
}));

const gallerySecret: Photo[] = Array.from({ length: 8 }, (_, i) => ({
  src: `/photos/gallery/secret-${String(i + 1).padStart(3, "0")}.jpg`,
  alt: "",
  objectPosition: "50% 40%",
}));

// TODO: 名前・読み・各項目の値は本人確認が取れてから入れる。勝手に作らない。
const profilePublic: ProfileContent = {
  name: EMPTY,
  reading: EMPTY,
  photo: { src: "/photos/portrait/public.jpg", alt: "", objectPosition: "50% 30%" },
  items: [
    { label: "生年月日", value: EMPTY },
    { label: "出身", value: EMPTY },
    { label: "身長", value: EMPTY },
    { label: "趣味", value: EMPTY },
    { label: "特技", value: EMPTY },
  ],
};

// TODO: 裏モードの文言も同様に未確定。
const profileSecret: ProfileContent = {
  name: EMPTY,
  reading: EMPTY,
  photo: { src: "/photos/portrait/secret.jpg", alt: "", objectPosition: "50% 30%" },
  items: [
    { label: "好きな時間", value: EMPTY },
    { label: "好きな音", value: EMPTY },
    { label: "苦手なもの", value: EMPTY },
    { label: "口ぐせ", value: EMPTY },
  ],
};

// TODO: 各 SNS の URL は本人のアカウントが確定してから入れる。EMPTY のあいだは非活性。
const linksPublic: LinkEntry[] = [
  { id: "instagram", label: "Instagram", href: EMPTY },
  { id: "x", label: "X", href: EMPTY },
  { id: "youtube", label: "YouTube", href: EMPTY },
  { id: "tiktok", label: "TikTok", href: EMPTY },
  { id: "line", label: "LINE", href: EMPTY },
];

const linksSecret: LinkEntry[] = [
  { id: "instagram", label: "Instagram", href: EMPTY },
  { id: "x", label: "X", href: EMPTY },
];

export const MODE_CONTENT: Record<Mode, ModeContent> = {
  public: {
    hero: heroPublic,
    profile: profilePublic,
    gallery: galleryPublic,
    links: linksPublic,
  },
  secret: {
    hero: heroSecret,
    profile: profileSecret,
    gallery: gallerySecret,
    links: linksSecret,
  },
};

export const CONTACT = {
  heading: "CONTACT",
  note: "お仕事のご依頼・お問い合わせ",
  // TODO: 連絡先メールアドレスが決まったら入れる。
  email: EMPTY as string,
};

export const FOOTER = {
  // TODO: © の表記名が決まったら入れる。
  copyrightName: EMPTY as string,
  year: 2026,
};

/** ファーストビューの切り替え間隔（秒）とクロスフェードの長さ（秒）。 */
export const HERO_TIMING = {
  intervalSec: 4.2,
  fadeSec: 0.9,
} as const;

/** 表裏の切り替えにかける時間（秒）。 */
export const MODE_TRANSITION_SEC = 0.55;
