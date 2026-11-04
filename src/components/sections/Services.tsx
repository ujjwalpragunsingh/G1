import {
  AirVent,
  Bluetooth,
  CarFront,
  Check,
  DoorOpen,
  Droplets,
  Fan,
  Lightbulb,
  Refrigerator,
  Shirt,
  Sparkles,
  Truck,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  BOOKING_TERMS,
  FULL_DAY_HOURS,
  HALF_DAY_HOURS,
  MIN_CUSTOM_HOURS,
  STUDIO_AMENITIES,
  STUDIO_PACKAGES,
  STUDIO_POLICIES,
} from "@/data/studio";

// Matched by name, so adding or reordering amenities can't mix up icons.
// A new amenity without an entry here gets the check mark.
const AMENITY_ICONS: Record<string, LucideIcon> = {
  Lighting: Lightbulb,
  "Makeup room": Sparkles,
  "Changing room": DoorOpen,
  "Steam iron": Shirt,
  "Air conditioning": AirVent,
  Parking: CarFront,
  "Bluetooth speaker": Bluetooth,
  "Wi-Fi": Wifi,
  "Water dispenser": Droplets,
  Refrigerator: Refrigerator,
  "Standing fan": Fan,
  "Equipment trolley": Truck,
};

const numbered = (index: number) => String(index + 1).padStart(2, "0");

export default function Services() {
  return (
    <section id="services" className="bg-background px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader eyebrow="The studio / what you get" title="Everything behind the frame.">
          The essentials are taken care of, so your team can focus on making the shot.
        </SectionHeader>

        <ul className="reveal grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {STUDIO_AMENITIES.map((amenity) => {
            const Icon = AMENITY_ICONS[amenity] ?? Check;
            return (
              <li key={amenity} className="flex min-h-28 flex-col justify-between gap-6 bg-card p-4 md:min-h-32 md:p-5">
                <Icon aria-hidden="true" className="size-5 text-primary" strokeWidth={1.6} />
                <span className="text-sm font-medium uppercase tracking-wide text-foreground">{amenity}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-7">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              More ways to book
            </span>
            <h3 className="mb-7 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Bring two sets together.
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {STUDIO_PACKAGES.map((option) => (
                <div key={option.name} className="bg-card p-5 md:p-6">
                  <h4 className="text-lg font-semibold text-foreground">{option.name}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{option.description}</p>
                  <p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">
                    {HALF_DAY_HOURS} hours, {FULL_DAY_HOURS} hours or custom ({MIN_CUSTOM_HOURS}+ hours)
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Ask the studio for rates, availability and set-combination options.
            </p>
          </div>

          <div className="reveal lg:col-span-5">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Before your shoot
            </span>
            <h3 className="mb-7 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              A few helpful details.
            </h3>
            <ol className="space-y-4">
              {BOOKING_TERMS.map((term, index) => (
                <li key={term} className="flex gap-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  <span className="shrink-0 pt-0.5 text-xs font-semibold tabular-nums text-primary">{numbered(index)}</span>
                  {term}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <details className="group mt-12">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-muted/60 px-5 py-5 text-sm font-semibold uppercase tracking-wide text-foreground">
            Studio policies
            <span className="text-xl text-primary transition-transform group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <ol className="grid gap-x-10 gap-y-4 bg-card px-5 py-6 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
            {STUDIO_POLICIES.map((policy, index) => (
              <li key={policy} className="flex gap-3">
                <span className="shrink-0 pt-0.5 text-xs font-semibold tabular-nums text-primary">{numbered(index)}</span>
                {policy}
              </li>
            ))}
          </ol>
        </details>
      </div>
    </section>
  );
}
