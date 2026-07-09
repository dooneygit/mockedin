"use client";

import { useRef, type ChangeEvent, type ReactNode } from "react";

export function ImageUpload({
  src,
  onChange,
  children,
  className,
  ariaLabel,
}: {
  src?: string;
  onChange: (dataUrl: string) => void;
  children: (src: string | undefined) => ReactNode;
  className?: string;
  ariaLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => inputRef.current?.click()}
      className={`group relative cursor-pointer overflow-hidden ${className ?? ""}`}
    >
      {children(src)}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
        Click to upload
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </button>
  );
}
