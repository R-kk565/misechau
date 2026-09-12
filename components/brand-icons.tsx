import type { SVGProps } from "react";
import type { LinkId } from "@/lib/site-content";

/**
 * lucide-react はブランドアイコン（Instagram / YouTube など）を提供していないので、
 * 塗りのパスを自前で描く。
 * 抜き文字（YouTube の三角、LINE の文字）は白で塗らず fill-rule="evenodd" の穴にして、
 * 背景の色が透けるようにする（配色が変わっても潰れない）。
 */

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8Zm2 0a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm8-1a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm5.2-2.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z" />
    </Svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </Svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </Svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.78.12V9.77a5.74 5.74 0 0 0-.78-.05 5.75 5.75 0 1 0 5.75 5.75V9.01a7.35 7.35 0 0 0 4.29 1.37V7.3a4.28 4.28 0 0 1-3.3-1.48Z" />
    </Svg>
  );
}

export function LineIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2C6.2 2 1.5 5.9 1.5 10.7c0 4.3 3.7 7.9 8.7 8.6.34.07.8.22.92.5.1.26.07.66.03.92l-.15.9c-.05.27-.21 1.05.92.57 1.13-.48 6.1-3.6 8.3-6.16 1.53-1.68 2.26-3.38 2.26-5.27C22.5 5.9 17.8 2 12 2ZM4.2 8h1.5v3.9h2.2v1.4H4.2V8Zm4.4 0h1.5v5.3H8.6V8Zm2.4 0h1.4l2 3V8h1.4v5.3h-1.4l-2-3v3H11V8Zm5.6 0h3.2v1.4H18v.8h1.8v1.4H18v.8h1.8v1.4h-3.2V8Z" />
    </Svg>
  );
}

export const BRAND_ICONS: Record<LinkId, (props: IconProps) => React.JSX.Element> = {
  instagram: InstagramIcon,
  x: XIcon,
  youtube: YouTubeIcon,
  tiktok: TikTokIcon,
  line: LineIcon,
};
