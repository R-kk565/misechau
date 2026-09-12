"use client";

import Image from "next/image";
import { useMode } from "@/lib/mode";
import { MODE_CONTENT } from "@/lib/site-content";

/** 3 カラムのメイソンリー一覧（スマホ 1・小さめのタブレット 2 カラム）。 */
export function GalleryGrid() {
  const mode = useMode();
  const photos = MODE_CONTENT[mode].gallery;

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
      {photos.map((photo, index) => (
        <figure
          key={photo.src}
          className="mb-4 break-inside-avoid overflow-hidden rounded-[14px] bg-line"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={800}
            height={1067}
            sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 90vw"
            className="h-auto w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
          />
          <figcaption className="sr-only">{String(index + 1).padStart(3, "0")}</figcaption>
        </figure>
      ))}
    </div>
  );
}
