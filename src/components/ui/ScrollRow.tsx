"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ARROW_CLASS =
  "flex size-11 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-30";

/**
 * A row of cards that you swipe sideways on phones, and scroll with the arrow buttons on bigger screens.
 * Children are the cards, each an <li>. The row runs to the screen edges inside a section's padding.
 */
export function ScrollRow({ label, aside, children }: { label: string; aside?: ReactNode; children: ReactNode }) {
  const rowRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = () => {
    const row = rowRef.current;
    if (!row) return;
    setEdges({ start: row.scrollLeft < 8, end: row.scrollLeft + row.clientWidth > row.scrollWidth - 8 });
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const row = rowRef.current;
    const card = row?.firstElementChild as HTMLElement | null;
    if (!row || !card) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div>
      <ul
        ref={rowRef}
        aria-label={label}
        onScroll={updateEdges}
        // Sideways trackpad swipes scroll the row itself instead of the page
        data-lenis-prevent-horizontal
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto overscroll-x-contain px-6 pb-1 [scrollbar-width:none] md:-mx-12 md:scroll-px-12 md:gap-4 md:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>

      <div className="mt-6 flex items-center justify-between gap-6">
        <div>{aside}</div>
        <div className="hidden shrink-0 gap-2 md:flex">
          <button type="button" onClick={() => scrollByCard(-1)} disabled={edges.start} aria-label="Scroll back" className={ARROW_CLASS}>
            <ArrowLeft aria-hidden="true" className="size-4" />
          </button>
          <button type="button" onClick={() => scrollByCard(1)} disabled={edges.end} aria-label="Scroll forward" className={ARROW_CLASS}>
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
