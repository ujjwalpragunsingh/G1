import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SETS } from "@/data/sets";
import { FULL_DAY_HOURS, HALF_DAY_HOURS, MIN_CUSTOM_HOURS } from "@/data/studio";

export default function StudioStory() {
  return (
    <section id="studio-story" className="bg-background px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader eyebrow="Our story" title="Born from a passion for the art of the frame." />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <figure className="reveal relative aspect-[16/10] overflow-hidden bg-muted lg:col-span-7">
            {/* Same name as the Our Story page photo, so it morphs between the two */}
            <ViewTransition name="studio-floor" share="morph" default="none">
              <Image
                src="/images/studio/studio-floor.webp"
                alt="The Girgit Studios floor with its cyclorama, stone feature wall and set corners"
                fill
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="parallax object-cover"
              />
            </ViewTransition>
            <figcaption className="absolute bottom-5 left-5 bg-background/90 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-foreground">
              Girgit Studios, Noida
            </figcaption>
          </figure>

          <div className="reveal flex flex-col justify-center gap-6 text-base leading-relaxed text-muted-foreground lg:col-span-5">
            <p>
              Girgit Studios was established to address a specific need: providing visual artists
              and brand directors a space that matches the scale of their ambitions.
            </p>
            <p>
              Choose from {SETS.length} distinct studio sets, from the Girgit Wall cyclorama and vivid
              Indian-inspired sets to modern interiors and refined feature walls. Each space brings
              its own textures, palette and atmosphere to your frame.
            </p>
            <p>
              The studio is equipped with lighting, a makeup room, changing room, Wi-Fi and other
              practical shoot-day essentials. Book {HALF_DAY_HOURS} or {FULL_DAY_HOURS} hours, or a custom
              slot from {MIN_CUSTOM_HOURS} hours, and plan your production around the space you need.
            </p>
            <Link
              href="/our-story"
              className="inline-flex h-12 w-fit items-center gap-2 bg-foreground px-7 text-xs font-bold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/85"
            >
              Meet the founders
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <figure className="reveal mx-auto mt-16 flex max-w-4xl flex-col gap-4 bg-card p-8 md:mt-20 md:flex-row md:items-center md:justify-between md:p-12">
          <blockquote className="text-xl font-medium uppercase tracking-wide text-foreground md:text-2xl">
            &ldquo;Every frame needs a world.&rdquo;
          </blockquote>
          <figcaption className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            The space behind the frame
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
