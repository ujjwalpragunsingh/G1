import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SETS } from "@/data/sets";

export default function Showcase() {
  return (
    <section id="showcase" className="bg-background px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow={`Spaces / 01–${String(SETS.length).padStart(2, "0")}`}
          title="Find your frame."
        >
          Distinctive sets, each designed to give your next production its own look and feel.
        </SectionHeader>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {SETS.map((set) => (
            <li key={set.slug} className="reveal">
              <Link
                href={`/sets/${set.slug}`}
                className="group flex h-full min-w-0 flex-col overflow-hidden bg-card shadow-sm shadow-foreground/5 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {/* Same name as the photo on the set page, so it morphs between the two */}
                  <ViewTransition name={`set-photo-${set.slug}`} share="morph" default="none">
                    <Image
                      src={set.image}
                      alt={`${set.name} studio set`}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                  </ViewTransition>
                  <span className="absolute left-4 top-4 bg-black/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                    {set.category}
                  </span>
                  <span className="absolute bottom-4 right-4 bg-background/90 px-3 py-1.5 text-xs font-medium tracking-wide text-foreground">
                    {set.code}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {set.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {set.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {set.useCases.slice(0, 3).map((useCase) => (
                      <span
                        key={useCase}
                        className="bg-muted px-2.5 py-1 text-xs uppercase tracking-wide text-muted-foreground"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                    View set <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
