import type { Metadata } from "next";
import Link from "next/link";
import { GalleryGrid } from "@/components/gallery-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Lettering } from "@/components/lettering";

export const metadata: Metadata = {
  title: "GALLERY",
};

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main className="content-shell pb-16 pt-[110px]">
        <h1 className="mb-10">
          <Lettering keyName="gallery" height={34} />
        </h1>
        <GalleryGrid />
        <div className="mt-14 text-center">
          <Link
            href="/"
            className="text-[10px] tracking-[0.24em] text-muted transition-colors duration-300 hover:text-accent"
          >
            BACK
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
