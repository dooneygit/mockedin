"use client";

import { useEffect, useRef } from "react";

import { loadMockup, saveMockup } from "@/lib/mockupStorage";
import type { MockupState } from "@/types/profile";

export function useMockupStorage(
  state: MockupState,
  onHydrate: (saved: MockupState) => void,
  onWarning?: (message: string) => void,
) {
  const hydrateRef = useRef(onHydrate);
  const warnRef = useRef(onWarning);
  const skipNextSave = useRef(true);

  useEffect(() => {
    hydrateRef.current = onHydrate;
    warnRef.current = onWarning;
  });

  // Hydrate from localStorage once, after mount (keeps SSR/first render on
  // defaults to avoid a hydration mismatch).
  useEffect(() => {
    const saved = loadMockup();
    if (saved) hydrateRef.current(saved);
  }, []);

  // Persist on change, debounced.
  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const result = saveMockup(state);
      if (!result.ok) warnRef.current?.(result.message);
    }, 400);
    return () => clearTimeout(timer);
  }, [state]);
}
