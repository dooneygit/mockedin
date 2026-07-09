export function EntryLogo({
  src,
  fallbackBg,
  letter,
  size = "lg",
}: {
  src?: string;
  fallbackBg: string;
  letter: string;
  size?: "sm" | "lg";
}) {
  const dims = size === "sm" ? "h-8 w-8 text-sm" : "h-12 w-12";
  return (
    <div
      className={`flex ${dims} shrink-0 items-center justify-center rounded-sm text-white font-semibold overflow-hidden`}
      style={{ background: src ? "transparent" : fallbackBg }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        letter
      )}
    </div>
  );
}
