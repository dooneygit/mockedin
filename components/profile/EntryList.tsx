"use client";

import { EditableText } from "@/components/profile/EditableText";
import { EntryLogo } from "@/components/profile/EntryLogo";
import type { Entry, LogoTarget } from "@/types/profile";

export function EntryList({
  entries,
  fallbackBg,
  logoNameField,
  titleLabel,
  subtitleLabel,
  removeLabel,
  targetType,
  onLogoClick,
  onUpdate,
  onRemove,
}: {
  entries: Entry[];
  fallbackBg: string;
  /** Field whose value names the logo — `subtitle` (company) for experience, `title` (school) for education. */
  logoNameField: "title" | "subtitle";
  titleLabel: string;
  subtitleLabel: string;
  removeLabel: string;
  targetType: LogoTarget["type"];
  onLogoClick: (target: LogoTarget) => void;
  onUpdate: (id: string, patch: Partial<Entry>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <>
      {entries.map((entry, i) => {
        const logoName = entry[logoNameField];
        return (
          <div key={entry.id}>
            {i > 0 && (
              <hr style={{ border: "none", borderTop: "1px solid #e9e5df" }} className="mb-5" />
            )}
          <div className="flex gap-3">
            <button
              type="button"
              aria-label={`View ${logoName} logo`}
              onClick={() => onLogoClick({ type: targetType, id: entry.id })}
              className="group relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-md"
            >
              <EntryLogo
                src={entry.logo}
                fallbackBg={fallbackBg}
                letter={logoName.charAt(0)}
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
                Edit
              </span>
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">
                <EditableText
                  ariaLabel={titleLabel}
                  value={entry.title}
                  onChange={(v) => onUpdate(entry.id, { title: v })}
                />
              </p>
              <p className="text-sm">
                <EditableText
                  ariaLabel={subtitleLabel}
                  value={entry.subtitle}
                  onChange={(v) => onUpdate(entry.id, { subtitle: v })}
                />
              </p>
              <p className="text-sm text-[var(--li-text-secondary)]">
                <EditableText
                  ariaLabel="Date range"
                  value={entry.dateRange}
                  onChange={(v) => onUpdate(entry.id, { dateRange: v })}
                />
              </p>
              <p className="text-sm mt-2">
                <EditableText
                  ariaLabel="Description"
                  value={entry.description}
                  onChange={(v) => onUpdate(entry.id, { description: v })}
                  multiline
                />
              </p>
            </div>
            <button
              type="button"
              aria-label={removeLabel}
              onClick={() => onRemove(entry.id)}
              className="flex h-8 w-8 shrink-0 self-center items-center justify-center rounded-full text-2xl text-[var(--li-text-primary)] hover:bg-black/5"
            >
              −
            </button>
          </div>
          </div>
        );
      })}
    </>
  );
}
