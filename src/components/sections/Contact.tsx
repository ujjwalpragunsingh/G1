import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { InquiryForm } from "@/components/sections/InquiryForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  FULL_DAY_HOURS,
  GOOGLE_MAPS,
  HALF_DAY_HOURS,
  MIN_CUSTOM_HOURS,
  STUDIO_ADDRESS,
  STUDIO_CONTACT,
} from "@/data/studio";

function ContactItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
      <dd className="text-base leading-relaxed text-foreground">{children}</dd>
    </div>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="bg-background px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader eyebrow="Contact" title="Plan your shoot.">
          Share your date, set and crew size, and we&apos;ll confirm availability on WhatsApp.
        </SectionHeader>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-24">
          <div className="reveal lg:col-span-7">
            <InquiryForm />
          </div>

          <dl className="reveal grid content-start gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            <ContactItem label="Studio">
              {STUDIO_ADDRESS}
              <span className="block text-muted-foreground">{STUDIO_CONTACT.landmark}</span>
              <a
                href={GOOGLE_MAPS.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary underline-offset-4 hover:underline"
              >
                Get directions
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            </ContactItem>
            <ContactItem label="Booking hours">
              Half day: {HALF_DAY_HOURS} hours
              <br />
              Full day: {FULL_DAY_HOURS} hours
              <br />
              Custom: {MIN_CUSTOM_HOURS} hours or more
            </ContactItem>
            <ContactItem label="Email">
              <a
                href={`mailto:${STUDIO_CONTACT.email}`}
                className="font-medium underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                {STUDIO_CONTACT.email}
              </a>
            </ContactItem>
            <ContactItem label="Phone">
              <span className="flex flex-col gap-1">
                {STUDIO_CONTACT.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replaceAll(" ", "")}`}
                    className="underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    {phone}
                  </a>
                ))}
              </span>
            </ContactItem>
            {STUDIO_CONTACT.socials.length > 0 && (
              <ContactItem label="Follow">
                <span className="flex flex-wrap gap-x-6 gap-y-2">
                  {STUDIO_CONTACT.socials.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline-offset-4 transition-colors hover:text-primary hover:underline"
                    >
                      {social.label}
                    </a>
                  ))}
                </span>
              </ContactItem>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
