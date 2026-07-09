"use client";

import { useRef, type ChangeEvent } from "react";

import { logoDevImageUrl, useLogoSearch, type LogoResult } from "@/hooks/useLogoSearch";
import type { LogoTarget } from "@/types/profile";

export function LogoModal({
  target,
  src,
  onClose,
  onUpload,
  onApply,
}: {
  target: LogoTarget;
  src?: string;
  onClose: () => void;
  onUpload: (dataUrl: string) => void;
  onApply: (result: LogoResult) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { searchQuery, setSearchQuery, searchResults, searchStatus } = useLogoSearch();

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      onUpload(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="li-card flex h-[460px] w-[720px] overflow-hidden">
        {/* Left pane */}
        <div className="relative flex flex-1 flex-col">
          <div className="px-6 pt-3 pb-3">
            <h2 className="text-xl font-semibold">
              {target.type === "experience" ? "Company logo" : "Education logo"}
            </h2>
          </div>
          <hr className="border-[var(--li-border)]" />
          <div className="flex flex-1 items-center justify-center">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              className="max-h-75 max-w-75 object-contain"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-sm bg-zinc-200 text-4xl text-zinc-500">
              ?
            </div>
          )}
          </div>
          <div className="px-6 pb-5">
            <button
              type="button"
              className="rounded-full bg-[var(--li-blue)] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[var(--li-blue-hover)]"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        </div>
        {/* Right pane */}
        <div className="w-82 border-l border-[var(--li-border)] flex flex-col">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-b border-[var(--li-border)] h-10 px-3 focus:outline-none"
            placeholder="Search for a logo"
          />
          <div className="flex-1 overflow-y-auto">
            {searchStatus === "loading" && <p className="p-3">Searching…</p>}
            {searchStatus === "error" && <p className="p-3">Something went wrong</p>}
            {searchStatus === "idle" &&
              searchQuery.trim() !== "" &&
              searchResults.length === 0 && <p className="p-3">No results</p>}
            {searchResults.map((r) => (
              <button
                key={r.domain}
                type="button"
                className="flex w-full items-center gap-3 border-b border-[var(--li-border)] p-2 text-left hover:bg-black/5"
                onClick={() => onApply(r)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoDevImageUrl(r.domain, 40)}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-sm object-contain"
                />
                <p className="truncate text-sm font-semibold">{r.name}</p>
              </button>
            ))}
          </div>
          <a
            href="https://logo.dev"
            target="_blank"
            rel="noopener"
            className="shrink-0 border-t border-[var(--li-border)] p-2 text-center text-xs text-[var(--li-text-secondary)] hover:underline"
          >
            Logos provided by Logo.dev
          </a>
        </div>
      </div>
    </div>
  );
}
