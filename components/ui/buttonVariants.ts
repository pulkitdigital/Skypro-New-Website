import { cva } from "class-variance-authority";

/**
 * Button classes, kept apart from button.tsx so Server Components can use them: button.tsx
 * imports from the `radix-ui` barrel, and a server-side import of that barrel registers every
 * Radix client component as a client entry (≈60 KB more first-load JS).
 *
 * Primary = amber fill, navy text, 4px radius, uppercase Barlow Condensed. Secondary actions
 * are text links with an arrow (`.link-arrow`), not outline buttons. Only the hero Enquire
 * pill is fully round.
 */
export const buttonVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center gap-2.5 font-display font-semibold uppercase tracking-[0.04em] whitespace-nowrap transition-[background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        amber: "rounded-[4px] bg-amber text-navy hover:shadow-[0_10px_24px_-12px_rgb(0_31_63/0.55)]",
        navy: "rounded-[4px] bg-navy text-white hover:bg-navy-deep",
        pill: "rounded-full bg-navy-deep/80 text-white ring-1 ring-white/20 hover:bg-amber hover:text-navy hover:ring-amber",
      },
      size: {
        sm: "h-10 px-4 text-[15px] [&_svg]:size-[18px]",
        md: "h-12 px-6 text-[17px] [&_svg]:size-5",
        lg: "h-14 px-8 text-[18px] [&_svg]:size-[22px]",
      },
    },
    defaultVariants: { variant: "amber", size: "md" },
  },
);
