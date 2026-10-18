"use client";

export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(event) => {
        event.preventDefault();
        const main = document.getElementById("main");
        main?.focus({ preventScroll: true });
        main?.scrollIntoView({ block: "start" });
      }}
      className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-[4px] bg-amber px-5 py-3 font-display text-[17px] font-semibold tracking-[0.04em] text-navy uppercase transition-transform focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
