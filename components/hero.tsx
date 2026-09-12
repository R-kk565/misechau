"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMode, useReducedMotion } from "@/lib/mode";
import { HERO_TIMING, MODE_CONTENT } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export function Hero() {
  const mode = useMode();
  const reduced = useReducedMotion();
  const photos = MODE_CONTENT[mode].hero;

  const [index, setIndex] = useState(0);
  const [renderedMode, setRenderedMode] = useState(mode);
  // props（モード）の変化に state を寄せるときは、レンダー中に state を合わせる。
  if (mode !== renderedMode) {
    setRenderedMode(mode);
    setIndex(0);
  }

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const count = photos.length;
    if (count <= 1 || reduced) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      HERO_TIMING.intervalSec * 1000,
    );
    return () => window.clearInterval(id);
  }, [photos.length, reduced]);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage || reduced) return;

    let cleanup = () => {};
    let cancelled = false;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // svh を直接動かさず、0→1 の CSS 変数だけ動かす。寸法は calc() 側で組み立てる。
      const tween = gsap.fromTo(
        stage,
        { "--hero-p": 0 },
        {
          "--hero-p": 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35,
          },
        },
      );

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduced]);

  const secret = mode === "secret";

  return (
    <section id="top" ref={sectionRef} className="relative h-[160svh] w-full">
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center">
        <div
          ref={stageRef}
          className="relative overflow-hidden bg-card"
          style={{
            width: "calc(86% + 14% * var(--hero-p))",
            height: "calc(78svh + 22svh * var(--hero-p))",
            borderRadius: "calc(20px * (1 - var(--hero-p)))",
          }}
        >
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className="absolute inset-0"
              style={{
                opacity: i === index ? 1 : 0,
                transition: `opacity ${HERO_TIMING.fadeSec}s ease-in-out`,
              }}
              aria-hidden={i === index ? undefined : true}
            >
              {/*
                裏モードは「顔と胸が必ず全部映る」ことが絶対条件。
                cover のままだと横長の PC 画面では縦長写真の縦 4 割しか映らず、
                頭から胸までは収まらない。裏モードだけ表示方式を変え、
                写真は常に全体表示（contain）、余白は同じ写真をぼかして暗くしたもので埋める。
              */}
              {secret && (
                <Image
                  src={photo.src}
                  alt=""
                  aria-hidden="true"
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="scale-110 object-cover blur-2xl brightness-[0.45] saturate-50"
                />
              )}
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className={cn("relative", secret ? "object-contain" : "object-cover")}
                // 写真ごとの切り取り位置。裏モードは全体が映るので打ち消す。
                style={{ objectPosition: secret ? "50% 50%" : (photo.objectPosition ?? "50% 50%") }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
