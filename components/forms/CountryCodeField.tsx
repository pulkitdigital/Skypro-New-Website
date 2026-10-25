"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { Check } from "@phosphor-icons/react/dist/csr/Check";
import { countryCodes, dialCode } from "@/data/countryCodes";
import { cn } from "@/lib/utils";
import { inputClass } from "./formLayout";

type Country = (typeof countryCodes)[number];

/** Listed first when several countries share the typed code (+1, +7, +39, +44). */
const PREFERRED = new Set(["US", "RU", "IT", "GB"]);

/** Typed digits ("+44", "44") match calling codes; letters match the country name or ISO code. */
function search(query: string): Country[] {
  const q = query.trim().toLowerCase();
  if (!q) return countryCodes;
  if (/^\+?\d+$/.test(q)) {
    const dial = q.startsWith("+") ? q : `+${q}`;
    const rank = (c: Country) => (c.dial === dial ? (PREFERRED.has(c.iso) ? 0 : 1) : 2);
    return countryCodes.filter((c) => c.dial.startsWith(dial)).sort((a, b) => rank(a) - rank(b));
  }
  const rank = (c: Country) => (c.iso.toLowerCase() === q ? 0 : c.name.toLowerCase().startsWith(q) ? 1 : 2);
  return countryCodes.filter((c) => c.name.toLowerCase().includes(q) || c.iso.toLowerCase() === q).sort((a, b) => rank(a) - rank(b));
}

/**
 * Country calling code as a type-to-search combobox (ARIA 1.2 pattern): shows "+91" when closed;
 * on focus it empties (the code stays as placeholder) and typing a code or a name filters the list.
 * ↑/↓ + Enter, or click, picks; Tab/blur after typing takes the highlighted match; Escape restores.
 */
export function CountryCodeField({
  id,
  label,
  value,
  onChange,
  onBlur,
  disabled,
  inputRef,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (iso: string) => void;
  onBlur: () => void;
  disabled?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null); // null = closed: the input shows the current code
  const [active, setActive] = useState(0);
  const list = useRef<HTMLUListElement>(null);

  const matches = useMemo(() => search(query ?? ""), [query]);
  const optionId = (iso: string) => `${listId}-${iso}`;

  useEffect(() => {
    if (!open) return;
    const el = list.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const current = dialCode(value) ?? "";
  const show = () => {
    setOpen(true);
    setQuery(""); // empty input with the current code as placeholder, so typing starts fresh
    setActive(Math.max(0, countryCodes.findIndex((c) => c.iso === value)));
  };
  const close = () => {
    setOpen(false);
    setQuery(null);
  };
  const pick = (c: Country | undefined) => {
    if (c) onChange(c.iso);
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return show();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => Math.min(matches.length - 1, Math.max(0, i + step)));
    } else if (e.key === "Enter") {
      if (!open) return;
      e.preventDefault(); // don't submit the form
      pick(matches[active]);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      close();
    }
  };

  return (
    <div className="relative w-[112px] shrink-0">
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && matches[active] ? optionId(matches[active].iso) : undefined}
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        value={query ?? current}
        placeholder={current}
        onFocus={show}
        onClick={() => !open && show()}
        onChange={(e) => {
          // typed straight after a pick (list closed): keep only the new characters
          const text = e.target.value;
          setQuery(query === null && text.startsWith(current) ? text.slice(current.length) : text);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => {
          if (query) pick(matches[active]);
          else close();
          onBlur();
        }}
        className={cn(inputClass, "pr-9 pl-3 font-mono text-[15px]")}
      />
      <CaretDown weight="light" aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-[18px] -translate-y-1/2 text-navy" />

      <ul
        ref={list}
        id={listId}
        role="listbox"
        aria-label={label}
        data-lenis-prevent
        hidden={!open}
        // keep focus in the input while choosing with the mouse
        onMouseDown={(e) => e.preventDefault()}
        className="absolute top-full left-0 z-30 mt-1.5 max-h-[300px] w-72 max-w-[calc(100vw-32px)] overflow-y-auto overscroll-contain rounded-[4px] border border-hairline bg-white py-1 text-ink shadow-[0_18px_40px_-24px_rgb(0_31_63/0.45)]"
      >
        {matches.length ? (
          matches.map((c, i) => (
            <li
              key={c.iso}
              id={optionId(c.iso)}
              role="option"
              aria-selected={c.iso === value}
              onClick={() => pick(c)}
              onMouseMove={() => setActive(i)}
              className={cn(
                "relative flex cursor-default items-center py-2.5 pr-9 pl-4 text-[15px] select-none",
                i === active && "bg-mist text-navy",
              )}
            >
              {c.name} ({c.dial})
              {c.iso === value ? <Check weight="regular" aria-hidden className="absolute right-3 size-3.5 text-navy" /> : null}
            </li>
          ))
        ) : (
          <li role="presentation" className="px-4 py-2.5 text-[15px] text-muted">
            No match
          </li>
        )}
      </ul>
    </div>
  );
}
