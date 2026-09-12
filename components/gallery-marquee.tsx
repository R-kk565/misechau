"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { useMode } from "@/lib/mode";
import { MODE_CONTENT, type Photo } from "@/lib/site-content";

const CARD_WIDTH = 208;
const CARD_HEIGHT = 286;

function MarqueeCard({ photo, index }: { photo: Photo; index: number }) {
  return (
    /* 間隔は gap ではなく padding-right で持たせる。
       同じ並びを 2 組置いて 50% 動かす方式では、gap だと 1 周ごとにずれるため。 */
    <div className="shrink-0 pr-[18px]" style={{ width: CARD_WIDTH + 18 }}>
      <div
        className="group relative overflow-hidden rounded-[14px] bg-line shadow-[var(--shadow)] transition-[translate] duration-300 ease-out hover:-translate-y-[10px] focus-within:-translate-y-[10px]"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="208px"
          /* 画面外から流れてくるので遅延読み込みにしない（空のカードが現れる）。 */
          loading="eager"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08] group-focus-within:scale-[1.08]"
          style={{ objectPosition: photo.objectPosition ?? "50% 50%" }}
        />
        <span className="absolute left-3 top-3 text-[10px] tracking-[0.2em] text-white/85 mix-blend-difference">
          {String(index + 1).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}

export function GallerySection() {
  const mode = useMode();
  const photos = MODE_CONTENT[mode].gallery;
  const duration = Math.max(24, photos.length * 4.6);

  return (
    <section id="gallery" className="scroll-mt-[70px] py-24">
      {/* 見出しは 844px の中に置き、流れる帯だけ画面幅いっぱいに出す。 */}
      <div className="content-shell">
        <SectionHeading keyName="gallery" className="mb-8" />
      </div>

      <div className="marquee-viewport marquee-mask w-full overflow-hidden">
        <div
          className="marquee-track"
          style={{ ["--marquee-duration" as string]: `${duration}s` }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1 ? true : undefined}>
              {photos.map((photo, index) => (
                <MarqueeCard key={`${copy}-${photo.src}`} photo={photo} index={index} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="content-shell mt-10 text-center">
        <Link
          href="/gallery"
          className="inline-block text-[10px] tracking-[0.24em] text-muted transition-colors duration-300 hover:text-accent"
        >
          VIEW ALL
        </Link>
      </div>
    </section>
  );
}
