import { HEADING_TEXT, LETTERING, type LetteringKey } from "@/lib/site-content";
import { cn } from "@/lib/utils";

/**
 * 見出しの筆文字。
 * 画像は <img> で貼らず CSS のマスクとして敷き currentColor で塗る
 * （黒い素材のままでも表／裏どちらの配色でも見えるようにするため）。
 * 寸法は非表示の <img> の縦横比から取るので、幅・高さの指定が要らない。
 */
export function Lettering({
  keyName,
  height = 34,
  className,
}: {
  keyName: LetteringKey;
  height?: number;
  className?: string;
}) {
  const src = LETTERING[keyName];
  const text = HEADING_TEXT[keyName];

  if (!src) {
    return (
      <span
        className={cn(
          "inline-block font-serif tracking-[0.28em] uppercase leading-none",
          className,
        )}
        style={{ fontSize: Math.round(height * 0.58) }}
      >
        {text}
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={text}
      className={cn("inline-block align-middle", className)}
      style={{
        height,
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
      }}
    >
      {/* 寸法取り専用。表示はマスク側が行う。 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden="true" className="block h-full w-auto invisible" />
    </span>
  );
}
