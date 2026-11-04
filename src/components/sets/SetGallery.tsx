"use client";

import { useState, ViewTransition } from "react";
import Image from "next/image";
import type { SetItem } from "@/data/sets";

const pad = (value: number) => String(value).padStart(2, "0");

export function SetGallery({ set }: { set: Pick<SetItem, "slug" | "name" | "code" | "category" | "gallery"> }) {
  const [active, setActive] = useState(0);
  const count = set.gallery.length;

  return (
    <div className="flex flex-col lg:col-span-7">
      <div className="relative min-h-[340px] flex-1 bg-muted sm:min-h-[480px] lg:min-h-[600px]">
        {/* Same name as the card photo on the home page, so it morphs between the two */}
        <ViewTransition name={`set-photo-${set.slug}`} share="morph" default="none">
          <Image
            src={set.gallery[active]}
            alt={`${set.name} at Girgit Studios, photo ${active + 1} of ${count}`}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 1023px) 100vw, 58vw"
            className="object-cover"
          />
        </ViewTransition>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
        <span className="absolute bottom-5 left-5 text-xs font-medium uppercase tracking-[0.14em] text-white md:bottom-8 md:left-8">
          {set.code} / {set.category}
        </span>
        {count > 1 && (
          <span className="absolute bottom-5 right-5 text-xs font-medium tabular-nums tracking-wider text-white md:bottom-8 md:right-8">
            {pad(active + 1)} / {pad(count)}
          </span>
        )}
      </div>

      {count > 1 && (
        <div className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-7 md:gap-3 md:p-4">
          {set.gallery.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1} of ${count}`}
              aria-pressed={index === active}
              className={`relative aspect-square overflow-hidden bg-muted transition-opacity ${
                index === active
                  ? "opacity-100 outline-2 outline-offset-2 outline-primary"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="(max-width: 639px) 25vw, 120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
