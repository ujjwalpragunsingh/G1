import type { Metadata } from "next";
import { ViewTransition, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FOUNDERS, type Founder } from "@/data/founders";
import { SETS } from "@/data/sets";
import { FULL_DAY_HOURS, HALF_DAY_HOURS, MIN_CUSTOM_HOURS, STUDIO_CONTACT, whatsappLink } from "@/data/studio";
import { OPEN_GRAPH_BASE, SITE_NAME, shareImage } from "@/lib/site";

const DESCRIPTION = `Meet the people behind ${SITE_NAME}, a photo and film studio with ${SETS.length} designed sets in Sector 49, Noida.`;

export const metadata: Metadata = {
  title: "Our story",
  description: DESCRIPTION,
  alternates: { canonical: "/our-story" },
  openGraph: {
    ...OPEN_GRAPH_BASE,
    title: `Our story · ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/our-story",
    images: [shareImage("home", "The Girgit Studios floor in Noida")],
  },
};

const STATS = [
  { value: String(SETS.length), label: "Designed sets" },
  { value: `${HALF_DAY_HOURS} / ${FULL_DAY_HOURS}`, label: "Hour slots" },
  { value: `${MIN_CUSTOM_HOURS}+`, label: "Custom hours" },
  { value: "49", label: `Sector, ${STUDIO_CONTACT.locality}` },
];

const pad = (value: number) => String(value).padStart(2, "0");
const enterDelay = (seconds: number) => ({ "--enter-delay": `${seconds}s` }) as CSSProperties;
const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function FounderPortrait({ founder, index }: { founder: Founder; index: number }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-primary">
      {founder.photo ? (
        <Image
          src={founder.photo}
          alt={`Portrait of ${founder.name}`}
          fill
          sizes="(max-width: 639px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        // Shown until a photo is added: their initials over the chameleon mark
        <div className="flex h-full items-center justify-center text-primary-foreground" aria-hidden="true">
          <Image
            src="/images/logos/logo-icon-white.png"
            alt=""
            width={1406}
            height={1364}
            className="absolute -bottom-[12%] -right-[16%] w-[80%] opacity-10"
          />
          <span className="text-[clamp(5rem,22vw,10rem)] font-bold leading-none tracking-[-0.06em]">
            {initials(founder.name)}
          </span>
        </div>
      )}
      <span className="absolute left-4 top-4 bg-black/55 px-3 py-1.5 text-xs font-semibold tabular-nums tracking-[0.12em] text-white backdrop-blur-sm">
        {pad(index + 1)} / {pad(FOUNDERS.length)}
      </span>
    </div>
  );
}

function FounderProfile({ founder, index }: { founder: Founder; index: number }) {
  return (
    <article id={founder.slug} aria-labelledby={`${founder.slug}-name`} className="reveal scroll-mt-28">
      <FounderPortrait founder={founder} index={index} />

      <span className="mt-7 block text-xs font-semibold uppercase tracking-[0.18em] text-primary">{founder.role}</span>
      <h3
        id={`${founder.slug}-name`}
        className="mt-3 break-words text-[clamp(2.1rem,4.6vw,3.75rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em] text-foreground"
      >
        {founder.name}
      </h3>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
        {founder.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {founder.quote && (
        <blockquote className="mt-8 border-l-2 border-primary pl-5 text-lg font-medium leading-snug text-foreground md:text-xl">
          &ldquo;{founder.quote}&rdquo;
        </blockquote>
      )}
      {founder.links.length > 0 && (
        <div className="mt-7 flex flex-wrap gap-3">
          {founder.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-foreground/15 px-5 text-xs font-bold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {link.label}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export default function OurStoryPage() {
  return (
    <main className="bg-background">
      {/* ---------------------------------------------------------------- */}
      {/* Hero: the studio floor, the same photo as on the home page       */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-[#08111a] text-white">
        {/* Same name as the home-page story photo, so it morphs between the two */}
        <ViewTransition name="studio-floor" share="morph" default="none">
          <Image
            src="/images/studio/studio-floor.webp"
            alt="The Girgit Studios floor with its cyclorama, stone feature wall and set corners"
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
          />
        </ViewTransition>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#08111a] via-[#08111a]/55 to-[#08111a]/25" />

        <div className="mx-auto w-full max-w-[1400px] px-6 pb-10 pt-32 md:px-12 md:pb-16">
          <span className="enter block text-xs font-semibold uppercase tracking-[0.18em] text-white/75" style={enterDelay(0.1)}>
            Our story · {STUDIO_CONTACT.coordinates}
          </span>
          <h1
            className="enter mt-5 max-w-5xl text-[clamp(2.75rem,10vw,7.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.045em]"
            style={enterDelay(0.2)}
          >
            The people behind the frame.
          </h1>
          <div className="enter mt-8 flex flex-wrap items-end justify-between gap-6" style={enterDelay(0.35)}>
            <p className="max-w-md text-base leading-relaxed text-white/80 md:text-lg">
              Girgit is Hindi for chameleon: one studio floor that changes its look for every story.
            </p>
            <a
              href="#founders"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white/15 px-5 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-colors hover:bg-white hover:text-[#08111a]"
            >
              Meet the founders
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Why the studio exists, and the studio in numbers                 */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 py-16 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <p className="reveal max-w-5xl text-[clamp(1.6rem,4.2vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.025em] text-foreground text-balance">
            Girgit Studios was built for one reason:{" "}
            <span className="text-muted-foreground">
              to give visual artists and brand directors a space that matches the scale of their ambitions.
            </span>
          </p>

          <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-16">
            <div className="reveal space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg lg:col-span-6">
              <p>
                Choose from {SETS.length} distinct sets, from the Girgit Wall cyclorama and vivid Indian-inspired
                spaces to modern interiors and refined feature walls. Each one brings its own textures, palette and
                atmosphere to your frame.
              </p>
              <p>
                Lighting, a makeup room, a changing room, Wi-Fi and the other shoot-day essentials are already in
                place, so your team can focus on making the shot.
              </p>
            </div>
            <dl className="reveal grid grid-cols-2 gap-px self-start overflow-hidden bg-border lg:col-span-5 lg:col-start-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse gap-2 bg-background p-5 md:p-7">
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{stat.label}</dt>
                  <dd className="text-4xl font-bold tracking-[-0.04em] text-foreground md:text-5xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Founders, side by side                                           */}
      {/* ---------------------------------------------------------------- */}
      <section id="founders" aria-labelledby="founders-heading" className="scroll-mt-28 px-6 pb-16 md:px-12 md:pb-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="reveal mb-10 md:mb-14">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              The founders
            </span>
            <h2
              id="founders-heading"
              className="text-3xl font-bold uppercase leading-[0.96] tracking-[-0.04em] text-foreground md:text-5xl"
            >
              Meet the makers.
            </h2>
          </div>

          {/* Side by side from tablet width up; stacked on phones so the bios stay readable */}
          <div className="grid gap-16 sm:grid-cols-2 sm:gap-8 lg:gap-16">
            {FOUNDERS.map((founder, index) => (
              <FounderProfile key={founder.slug} founder={founder} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Selected work from both founders, one category at a time         */}
      {/* ---------------------------------------------------------------- */}
      <section id="work" className="scroll-mt-28 overflow-hidden px-6 pb-16 md:px-12 md:pb-28">
        <div className="mx-auto max-w-[1400px] border-t border-border pt-12 md:pt-20">
          <SectionHeader eyebrow="From the founders" title="Selected work.">
            A few projects from the founders&apos; portfolio. Pick a category, and play a reel right here.
          </SectionHeader>
          <SelectedWork />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing line and next steps                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-[#08111a] px-6 py-20 text-white md:px-12 md:py-32">
        <div className="reveal mx-auto flex max-w-[1400px] flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">The space behind the frame</span>
            <p className="mt-5 text-[clamp(2.5rem,8vw,6rem)] font-bold uppercase leading-[0.92] tracking-[-0.045em]">
              Every frame
              <br />
              needs a world.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href="/#showcase"
              className="inline-flex h-12 items-center justify-center bg-white px-8 text-xs font-bold uppercase tracking-[0.16em] text-[#08111a] transition-colors hover:bg-white/85"
            >
              Explore the sets
            </Link>
            <a
              href={whatsappLink("Hi Girgit Studios! I'd like to visit the studio and see the sets.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 border border-white/30 px-8 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-white hover:bg-white hover:text-[#08111a]"
            >
              Plan a visit
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
