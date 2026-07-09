"use client";

import { useState, useEffect } from "react";

const LOGO_DEV_PK = process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY

export function logoDevImageUrl(domain: string, size = 200): string {
  return `https://img.logo.dev/${domain}?token=${LOGO_DEV_PK}&size=${size}&format=png`
}

export type LogoResult = { name: string; domain: string };

export function useLogoSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LogoResult[]>([]);
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setSearchStatus("idle");
      return;
    }

    setSearchStatus("loading");
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/logo-search?q=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal}
        );

        const data = await res.json();
        setSearchResults(data);
        setSearchStatus("idle");
      } catch (err) {
        if ((err as Error).name !== "AbortError") setSearchStatus("error");
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  return { searchQuery, setSearchQuery, searchResults, searchStatus };
}
