import type { Metadata, Viewport } from "next";
import { MODE_STORAGE_KEY } from "@/lib/mode-constants";
import { SECRET_MODE_ENABLED } from "@/lib/site-content";
import "./globals.css";

export const metadata: Metadata = {
  title: "OFFICIAL SITE",
  description: "オフィシャルサイト",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f9f9f8",
};

/**
 * 初回ペイント前に data-mode を決める（リロード時のちらつき防止）。
 * SECRET_MODE_ENABLED が false のときは保存済みの設定が残っていても必ず表モードで始まる。
 */
const modeBootScript = `(function(){try{var s=${SECRET_MODE_ENABLED ? "true" : "false"};var v=s?window.localStorage.getItem(${JSON.stringify(MODE_STORAGE_KEY)}):null;document.documentElement.dataset.mode=(s&&v==="secret")?"secret":"public";}catch(e){document.documentElement.dataset.mode="public";}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeBootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
