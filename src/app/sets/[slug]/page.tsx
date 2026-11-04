import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock3 } from "lucide-react";
import { SetGallery } from "@/components/sets/SetGallery";
import { SETS, getSet } from "@/data/sets";
import { FULL_DAY_HOURS, HALF_DAY_HOURS, MIN_CUSTOM_HOURS, whatsappLink } from "@/data/studio";
import { OPEN_GRAPH_BASE, SITE_NAME, shareImage } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Every set page is built ahead of time; unknown slugs are a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return SETS.map((set) => ({ slug: set.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const set = getSet((await params).slug);
  if (!set) return {};

  const description = `${set.category} set in Sector 49, Noida, bookable for ${HALF_DAY_HOURS} or ${FULL_DAY_HOURS} hours, or custom from ${MIN_CUSTOM_HOURS} hours. ${set.description}`;
  return {
    title: set.name,
    description,
    alternates: { canonical: `/sets/${set.slug}` },
    openGraph: {
      ...OPEN_GRAPH_BASE,
      title: `${set.name} · ${SITE_NAME}`,
      description,
      url: `/sets/${set.slug}`,
      images: [shareImage(set.slug, `${set.name} at Girgit Studios, Noida`)],
    },
  };
}

export default async function SetPage({ params }: Props) {
  const set = getSet((await params).slug);
  if (!set) notFound();

  const index = SETS.indexOf(set);
  const previous = SETS[(index - 1 + SETS.length) % SETS.length];
  const next = SETS[(index + 1) % SETS.length];
  const bookingLink = whatsappLink(
    `Hi Girgit Studios, I would like to check availability for ${set.name}. Please share the booking details.`
  );

  return (
    <main className="min-h-screen bg-background px-6 pb-20 pt-28 text-foreground md:px-12 md:pt-32">
      <div className="mx-auto max-w-[1400px]">
        <Link
          href="/#showcase"
          className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All studio sets
        </Link>

        <div className="grid overflow-hidden bg-card shadow-sm shadow-foreground/5 lg:grid-cols-12">
          <SetGallery set={set} />

          <div className="flex flex-col p-6 sm:p-8 md:p-12 lg:col-span-5 lg:p-14">
            <div id="overview" className="scroll-mt-28">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Find your frame
              </span>
              <h1 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.05em] text-foreground md:text-5xl">
                {set.name}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">{set.description}</p>

              <ul className="mt-7 flex flex-wrap gap-2">
                {set.useCases.map((useCase) => (
                  <li
                    key={useCase}
                    className="bg-muted px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {useCase}
                  </li>
                ))}
              </ul>

              <div id="tech-specs" className="mt-10 scroll-mt-28">
                <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground">Set details</h2>
                <ul className="mt-4 space-y-3">
                  {set.detailedSpecs.map((spec) => (
                    <li key={spec} className="flex gap-3 text-base leading-relaxed text-muted-foreground">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div id="booking" className="mt-10 scroll-mt-28 bg-muted/60 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground">Booking</h2>
              <dl className="mt-4 space-y-3">
                {[
                  { label: "Half day", hours: `${HALF_DAY_HOURS} hours` },
                  { label: "Full day", hours: `${FULL_DAY_HOURS} hours` },
                  { label: "Custom", hours: `${MIN_CUSTOM_HOURS}+ hours` },
                ].map(({ label, hours }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <dt className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 aria-hidden="true" className="size-4" />
                      {label}
                    </dt>
                    <dd className="text-lg font-semibold text-foreground">{hours}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Ask the studio for rates. Extra time can be added by the hour.
              </p>
              <a
                href={bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Check availability
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <nav aria-label="More sets" className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/sets/${previous.slug}`}
            className="group flex items-center gap-4 bg-card p-5 transition-colors hover:bg-muted"
          >
            <ArrowLeft aria-hidden="true" className="size-5 shrink-0 text-primary transition-transform group-hover:-translate-x-1" />
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Previous set</span>
              <span className="mt-1 block text-lg font-semibold text-foreground">{previous.name}</span>
            </span>
          </Link>
          <Link
            href={`/sets/${next.slug}`}
            className="group flex items-center justify-end gap-4 bg-card p-5 text-right transition-colors hover:bg-muted"
          >
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Next set</span>
              <span className="mt-1 block text-lg font-semibold text-foreground">{next.name}</span>
            </span>
            <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        </nav>

        <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Half day: {HALF_DAY_HOURS} hours / Full day: {FULL_DAY_HOURS} hours / Custom: {MIN_CUSTOM_HOURS}+ hours
          </span>
          <Link href="/#contact" className="font-medium text-foreground transition-colors hover:text-primary">
            Questions? Contact the studio
          </Link>
        </div>
      </div>
    </main>
  );
}
