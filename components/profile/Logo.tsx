export function Logo() {
  return (
    <div
      aria-label="LinkedIn"
      className="flex items-center text-[var(--li-blue)] select-none"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <span className="text-[40px] font-bold leading-none tracking-[-0.04em]">
        Mocked
      </span>
      <span className="ml-[4px] flex h-[40px] w-[40px] items-center justify-center rounded-[4px] bg-[var(--li-blue)]">
        <span className="text-[36px] font-bold leading-none text-white">
          in
        </span>
      </span>
    </div>
  );
}
