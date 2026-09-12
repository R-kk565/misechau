"use client";

import { useSyncExternalStore } from "react";
import { MODE_STORAGE_KEY } from "@/lib/mode-constants";
import { MODE_CONTENT, SECRET_MODE_ENABLED, type Mode, type ModeContent } from "@/lib/site-content";

export { MODE_STORAGE_KEY } from "@/lib/mode-constants";

function readInitialMode(): Mode {
  if (!SECRET_MODE_ENABLED) return "public";
  if (typeof document === "undefined") return "public";
  // 初回ペイント前に <head> の inline script が data-mode を決めている。
  return document.documentElement.dataset.mode === "secret" ? "secret" : "public";
}

let currentMode: Mode = readInitialMode();
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Mode {
  return currentMode;
}

function getServerSnapshot(): Mode {
  return "public";
}

export function setMode(next: Mode) {
  const resolved: Mode = SECRET_MODE_ENABLED ? next : "public";
  if (resolved === currentMode) return;
  currentMode = resolved;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.mode = resolved;
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, resolved);
    } catch {
      // プライベートブラウジングなどで保存できなくても動作は続ける
    }
  }
  emit();
}

export function toggleMode() {
  setMode(currentMode === "secret" ? "public" : "secret");
}

/** localStorage 由来のモードは外部ストアとして扱う（effect の中で setState しない）。 */
export function useMode(): Mode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useModeContent(): ModeContent {
  return MODE_CONTENT[useMode()];
}

const mediaStores = new Map<string, { subscribe: (l: () => void) => () => void; get: () => boolean }>();

function getMediaStore(query: string) {
  const existing = mediaStores.get(query);
  if (existing) return existing;
  const store = {
    subscribe(listener: () => void) {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", listener);
      return () => mql.removeEventListener("change", listener);
    },
    get() {
      if (typeof window === "undefined" || !window.matchMedia) return false;
      return window.matchMedia(query).matches;
    },
  };
  mediaStores.set(query, store);
  return store;
}

/** matchMedia も外部ストアとして扱う。 */
export function useMediaQuery(query: string): boolean {
  const store = getMediaStore(query);
  return useSyncExternalStore(store.subscribe, store.get, () => false);
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
