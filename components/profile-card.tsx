"use client";

import { useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { useMode, useReducedMotion, toggleMode } from "@/lib/mode";
import {
  EMPTY,
  MODE_CONTENT,
  MODE_TRANSITION_SEC,
  SECRET_MODE_ENABLED,
  isEmpty,
} from "@/lib/site-content";

const MAX_TILT_DEG = 7;
const LIFT_PX = 26;

function display(value: string) {
  return isEmpty(value) ? EMPTY : value;
}

export function ProfileSection() {
  const mode = useMode();
  const reduced = useReducedMotion();
  const profile = MODE_CONTENT[mode].profile;
  const cardRef = useRef<HTMLDivElement | null>(null);

  const applyTilt = (event: React.PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card || reduced) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = [
      `translateY(${-LIFT_PX}px)`,
      `rotateX(${(-py * MAX_TILT_DEG * 2).toFixed(2)}deg)`,
      `rotateY(${(px * MAX_TILT_DEG * 2).toFixed(2)}deg)`,
    ].join(" ");
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "translateY(0px) rotateX(0deg) rotateY(0deg)";
  };

  // SECRET_MODE_ENABLED が false のときはカードはスイッチにならず、表/裏の印も出さない。
  const interactiveProps = SECRET_MODE_ENABLED
    ? ({
        role: "switch" as const,
        tabIndex: 0,
        "aria-checked": mode === "secret",
        "aria-label": "表モードと裏モードを切り替える",
        onClick: () => toggleMode(),
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleMode();
          }
        },
      })
    : {};

  return (
    <section id="profile" className="content-shell scroll-mt-[70px] py-24">
      <SectionHeading keyName="profile" />

      <div
        className="flex justify-center"
        style={{ perspective: "1100px" }}
        onPointerMove={applyTilt}
        onPointerLeave={resetTilt}
        onPointerDown={applyTilt}
        onPointerUp={resetTilt}
        onPointerCancel={resetTilt}
      >
        <div className="profile-scaler">
          <div
            ref={cardRef}
            {...interactiveProps}
            className={[
              "relative flex h-full w-full overflow-hidden rounded-[18px] bg-card",
              "shadow-[var(--shadow)] transition-transform duration-500 ease-out",
              SECRET_MODE_ENABLED ? "cursor-pointer" : "",
            ].join(" ")}
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          >
            {/* 左 53% に縦長写真 */}
            <div className="relative h-full w-[53%] shrink-0 overflow-hidden bg-line">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${mode}-photo`}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: MODE_TRANSITION_SEC }}
                >
                  <Image
                    src={profile.photo.src}
                    alt={profile.photo.alt}
                    fill
                    sizes="220px"
                    className="object-cover"
                    style={{ objectPosition: profile.photo.objectPosition ?? "50% 50%" }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 右に名前・読み・区切り線・項目一覧 */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${mode}-text`}
                className="flex h-full min-w-0 flex-1 flex-col px-5 py-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: MODE_TRANSITION_SEC }}
              >
                <p className="truncate font-serif text-[19px] leading-none tracking-[0.08em] text-fg">
                  {display(profile.name)}
                </p>
                <p className="mt-2 truncate text-[10px] leading-none tracking-[0.2em] text-muted">
                  {display(profile.reading)}
                </p>

                <hr className="mt-4 border-0 border-t border-line" />

                {/*
                  項目数が変わっても縦のバランスが崩れないよう、
                  区切り線から下の残り高さを項目で均等に分ける。
                */}
                <ul className="flex min-h-0 flex-1 flex-col">
                  {profile.items.map((item) => (
                    <li
                      key={item.label}
                      className="flex flex-1 items-center justify-between gap-3 border-b border-line/60 last:border-b-0"
                    >
                      <span className="shrink-0 text-[9px] tracking-[0.16em] text-muted">
                        {item.label}
                      </span>
                      <span className="truncate text-[11px] tracking-[0.08em] text-fg">
                        {display(item.value)}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            {SECRET_MODE_ENABLED && (
              <span
                aria-hidden="true"
                className="absolute right-3 top-3 select-none text-[9px] tracking-[0.2em] text-muted"
              >
                {mode === "secret" ? "裏" : "表"}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
