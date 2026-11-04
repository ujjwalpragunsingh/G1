import { Navigation } from "lucide-react";
import { GOOGLE_MAPS, STUDIO_ADDRESS, STUDIO_CONTACT } from "@/data/studio";

export default function Location() {
  return (
    <section id="visit" aria-labelledby="visit-heading" className="bg-background px-6 pb-16 md:px-12 md:pb-24">
      <div className="reveal relative mx-auto max-w-[1400px]">
        {/* Loads only when scrolled near, so Google Maps doesn't slow down the rest of the page */}
        <div className="aspect-[4/3] overflow-hidden bg-muted sm:aspect-[16/9] lg:aspect-[21/8]">
          <iframe
            src={GOOGLE_MAPS.embed}
            title={`Map showing Girgit Studios at ${STUDIO_ADDRESS}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>

        {/* Below the map on phones, floating over its corner on bigger screens */}
        <div className="bg-card p-6 md:absolute md:bottom-6 md:right-6 md:max-w-sm md:bg-background/95 md:shadow-xl md:shadow-foreground/10 md:backdrop-blur-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Visit the studio</span>
          <h2 id="visit-heading" className="mt-3 text-xl font-semibold tracking-tight text-foreground">
            Girgit Studios, Sector 49
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {STUDIO_ADDRESS}
            <br />
            {STUDIO_CONTACT.landmark}
          </p>
          <a
            href={GOOGLE_MAPS.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-11 items-center gap-2 bg-primary px-5 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/85"
          >
            <Navigation aria-hidden="true" className="size-4" />
            Directions
          </a>
        </div>
      </div>
    </section>
  );
}
