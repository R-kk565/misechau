"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lettering } from "@/components/lettering";
import { NAV_ITEMS } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-[50px] bg-bg/85 backdrop-blur-md transition-colors duration-[550ms]">
        <div className="mx-auto flex h-full w-full max-w-content items-center justify-between px-5">
          <a
            href="#top"
            className="text-fg transition-colors duration-300 hover:text-accent"
            aria-label="OFFICIAL SITE"
          >
            <Lettering keyName="officialSite" height={16} />
          </a>

          <nav className="hidden items-center gap-7 sm:flex" aria-label="サイト内">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-[10px] tracking-[0.22em] text-muted transition-colors duration-300 hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="relative -mr-1 flex h-10 w-10 items-center justify-center sm:hidden"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">メニュー</span>
            <span aria-hidden="true" className="relative block h-[9px] w-[22px]">
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-fg transition-transform duration-300",
                  open ? "top-1 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-fg transition-transform duration-300",
                  open ? "top-1 -rotate-45" : "top-2",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-9 bg-bg sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            {NAV_ITEMS.map((item, index) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.3em] text-fg"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, delay: 0.05 + index * 0.05 }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
