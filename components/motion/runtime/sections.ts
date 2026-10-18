import { gsap, ScrollTrigger, type loadSplitText } from "@/lib/gsap";

export type SplitTextClass = Awaited<ReturnType<typeof loadSplitText>>;
export type Conditions = { desktop: boolean; tablet: boolean; mobile: boolean };

const sectionOf = (el: Element) => el.closest("section, footer") ?? el;

/** Hero → intro (desktop): the hero pins, scales to 0.92 with rounded corners and darkens
 *  while the intro slides up over it. Only `transform`/`opacity` animate (compositor-only). */
export function setupHero() {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const intro = document.querySelector<HTMLElement>("[data-intro]");
  if (!hero || !intro) return;
  ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom top", pin: true, pinSpacing: false, refreshPriority: 3 });
  gsap
    .timeline({ scrollTrigger: { trigger: intro, start: "top bottom", end: "top top", scrub: true, invalidateOnRefresh: true } })
    .fromTo(
      hero.querySelector("[data-hero-media]"),
      { scale: 1 },
      // the media layer is 48px wider than the viewport (corners off-screen) → visual scale 0.92
      { scale: () => (0.92 * window.innerWidth) / (window.innerWidth + 48), ease: "none" },
      0,
    )
    .fromTo(hero.querySelector("[data-hero-dim]"), { opacity: 0 }, { opacity: 0.5, ease: "none" }, 0)
    // the cloud bank on the boundary rises faster than the intro and thins out
    .fromTo(intro.querySelector('[data-cloud="hero-rise"]'), { yPercent: 35, opacity: 1 }, { yPercent: -70, opacity: 0, ease: "none" }, 0);
}

/**
 * Shared motion inside one section: line reveals on H1/H2, one fade/slide-up per content block
 * (y 30, 0.8s; card grids stagger their cards by 0.08s), clip-path reveals on big photos, stat
 * counters and the Academy Life column drift. Section "wow" effects live in features.ts.
 */
export function setupSection(root: Element, c: Conditions, Split: SplitTextClass | null) {
  const $ = <T extends HTMLElement = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector));
  const { desktop, tablet } = c;
  const large = desktop || tablet;
  const once = (trigger: Element, start = "top 88%") => ({ trigger, start, once: true });
  const rise = { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", clearProps: "opacity,transform" };

  /* H1/H2: SplitText line-mask reveal (tablet/desktop); a plain fade on phones. */
  $("[data-split]").forEach((el) => {
    // the hero-intro H1 is revealed by its flyby on tablet/desktop (features.ts)
    if (el.dataset.split === "flyby" && large) return;
    if (!large || !Split) {
      gsap.from(el, { opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: once(el, "top 92%") });
      return;
    }
    Split.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) => {
        if (el.dataset.revealed) return;
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { ...once(el, "top 90%"), onEnter: () => void (el.dataset.revealed = "1") },
        });
      },
    });
  });

  /* One fade/slide-up per content block. */
  $("[data-block]").forEach((el) => gsap.from(el, { ...rise, scrollTrigger: once(el) }));

  /* Card grids: the cards rise together, 0.08s apart. */
  $("[data-stagger]").forEach((el) => {
    const cards = Array.from(el.children);
    if (cards.length) gsap.from(cards, { ...rise, stagger: 0.08, scrollTrigger: once(el) });
  });

  /* Big photos: clip-path wipe upwards (tablet/desktop), a fade on phones. */
  $("[data-clip-reveal]").forEach((el) => {
    if (large) {
      gsap.fromTo(
        el,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.out", scrollTrigger: once(el, "top 90%") },
      );
    } else {
      gsap.from(el, { opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: once(el, "top 95%") });
    }
  });

  /* Stat counters (400+, 200, 6) — final values are in the HTML and restored on revert. */
  const counters = $("[data-counter]");
  counters.forEach((el, i) => {
    const end = Number(el.dataset.counter);
    const state = { v: 0 };
    el.textContent = "0";
    gsap.to(state, {
      v: end,
      duration: 1,
      delay: i * 0.06,
      ease: "power3.out",
      scrollTrigger: once(el, "top 95%"),
      onUpdate: () => {
        el.textContent = String(Math.round(state.v));
      },
    });
  });

  /* Academy Life: the mosaic columns drift at different speeds (desktop). */
  if (desktop) {
    const scrub = (el: Element) => ({ trigger: sectionOf(el), start: "top bottom", end: "bottom top", scrub: true });
    const speeds = [-5, 4, -3, 6];
    $("[data-life-column]").forEach((el, i) =>
      gsap.fromTo(el, { yPercent: -(speeds[i] ?? 0) }, { yPercent: speeds[i] ?? 0, ease: "none", scrollTrigger: scrub(el) }),
    );
  }

  return () => {
    counters.forEach((el) => (el.textContent = el.dataset.counter ?? el.textContent));
  };
}
