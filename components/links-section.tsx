"use client";

import { BRAND_ICONS } from "@/components/brand-icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { useMode } from "@/lib/mode";
import { MODE_CONTENT, isEmpty } from "@/lib/site-content";

const TILE_SIZE = "clamp(56px, 18vw, 96px)";

export function LinksSection() {
  const mode = useMode();
  const links = MODE_CONTENT[mode].links;

  return (
    <section id="links" className="scroll-mt-[70px] py-24">
      <div className="content-shell">
        <SectionHeading keyName="links" />
      </div>

      {/* 文字ラベルは出さず、ロゴだけ。320px 幅でも 1 列に収まるよう、
          タイルは画面幅に追従させ、行は本文幅の内側余白に縛られない。 */}
      <ul className="mx-auto flex w-full max-w-content flex-nowrap items-center justify-center gap-[clamp(6px,2.2vw,18px)] px-2">
        {links.map((link) => {
          const Icon = BRAND_ICONS[link.id];
          const disabled = isEmpty(link.href);
          const tile = (
            <>
              <Icon className="h-[42%] w-[42%]" />
              <span className="sr-only">{link.label}</span>
            </>
          );

          const base =
            "flex items-center justify-center rounded-[22%] border border-line bg-card transition-[translate,color,border-color] duration-300 ease-out";

          return (
            <li key={link.id}>
              {disabled ? (
                <span
                  aria-disabled="true"
                  title={`${link.label}（未設定）`}
                  className={`${base} cursor-not-allowed text-muted/50`}
                  style={{ width: TILE_SIZE, height: TILE_SIZE }}
                >
                  {tile}
                </span>
              ) : (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${base} text-fg hover:-translate-y-[4px] hover:border-accent hover:text-accent`}
                  style={{ width: TILE_SIZE, height: TILE_SIZE }}
                >
                  {tile}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
