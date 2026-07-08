"use client";

export function EditableText({
  value,
  onChange,
  fallback,
  className,
  multiline = false,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  /** Restored when the field is emptied. Whitespace-only text is kept as-is. */
  fallback: string;
  className?: string;
  multiline?: boolean;
  ariaLabel: string;
}) {
  return (
    <span
      role="textbox"
      aria-label={ariaLabel}
      contentEditable
      suppressContentEditableWarning
      className={`li-editable inline-block ${className ?? ""}`}
      onBlur={(e) => {
        const text = e.currentTarget.textContent ?? "";
        if (text === "") {
          // React won't re-render the node when `value` is already the fallback.
          e.currentTarget.textContent = fallback;
          onChange(fallback);
          return;
        }
        onChange(text);
      }}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
    >
      {value}
    </span>
  );
}
