"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { ScrollRow } from "@/components/ui/ScrollRow";
import { WORK_CATEGORIES, workEmbed } from "@/data/work";

// Height of a portrait reel embed at card width, kept until Instagram reports the real one
const INSTAGRAM_EMBED_HEIGHT = 616;

const CHIP_CLASS =
  "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-foreground/15 px-4 text-xs font-bold uppercase tracking-[0.14em] text-foreground/70 transition-colors hover:border-foreground hover:text-foreground aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background";

// Instagram's own embed. It posts its height to the page, so the card grows to fit the post.
function InstagramCard({ link, src, title }: { link: string; src: string; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(INSTAGRAM_EMBED_HEIGHT);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.instagram.com" || event.source !== frameRef.current?.contentWindow) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.type === "MEASURE" && data.details?.height > 0) setHeight(Math.ceil(data.details.height));
      } catch {
        // Not a message from the embed
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
      {/* Behind the embed: shows while it loads, or if it's blocked or the post is gone */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground"
      >
        <InstagramIcon className="size-7" />
        View on Instagram
      </a>
      <iframe ref={frameRef} src={src} title={title} loading="lazy" className="relative block w-full" style={{ height }} />
    </div>
  );
}

export function SelectedWork() {
  const [active, setActive] = useState(WORK_CATEGORIES[0]?.name);
  const category = WORK_CATEGORIES.find((item) => item.name === active) ?? WORK_CATEGORIES[0];
  if (!category) return null;

  return (
    <div>
      <div
        role="group"
        aria-label="Work categories"
        data-lenis-prevent-horizontal
        className="-mx-6 mb-8 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {WORK_CATEGORIES.map((item) => (
          <button
            key={item.name}
            type="button"
            aria-pressed={item.name === category.name}
            onClick={() => setActive(item.name)}
            className={CHIP_CLASS}
          >
            {item.name}
            <span className="tabular-nums opacity-60">{item.links.length}</span>
          </button>
        ))}
      </div>

      {/* Keyed by category so the row starts at its first card again */}
      <ScrollRow key={category.name} label={`Selected work: ${category.name}`}>
        {category.links.map((link, index) => {
          const embed = workEmbed(link);
          if (!embed) return null;
          const title = `${category.name} work ${index + 1} of ${category.links.length}`;

          return embed.kind === "instagram" ? (
            <li key={link} className="w-[min(80vw,326px)] shrink-0 snap-start">
              <InstagramCard link={link} src={embed.src} title={title} />
            </li>
          ) : (
            <li key={link} className="w-[min(85vw,560px)] shrink-0 snap-start">
              <div className="aspect-video overflow-hidden rounded-xl border border-border bg-muted">
                <iframe
                  src={embed.src}
                  title={title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="size-full"
                />
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Watch on YouTube
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            </li>
          );
        })}
      </ScrollRow>
    </div>
  );
}
