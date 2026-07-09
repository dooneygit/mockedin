"use client";

import { type ReactNode } from "react";

export function SectionCard({
  title,
  onAdd,
  showControls,
  children,
}: {
  title: string;
  onAdd: () => void;
  showControls: boolean;
  children: ReactNode;
}) {
  return (
    <section className="li-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {showControls && (
          <button
            type="button"
            aria-label={`Add ${title.toLowerCase()}`}
            onClick={onAdd}
            className="flex h-8 w-8 items-center justify-center rounded-full text-2xl text-[var(--li-text-primary)] hover:bg-black/5"
          >
            +
          </button>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
