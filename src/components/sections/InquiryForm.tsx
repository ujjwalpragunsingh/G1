"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { SETS } from "@/data/sets";
import { FULL_DAY_HOURS, HALF_DAY_HOURS, MIN_CUSTOM_HOURS, STUDIO_PACKAGES, whatsappLink } from "@/data/studio";

// 16px text stops iPhones zooming in when a field is tapped
const FIELD_CLASS =
  "w-full bg-muted/60 px-4 text-base text-foreground placeholder:text-muted-foreground/80 focus-visible:outline-offset-0";

const NOT_SURE = "Not sure yet";

const CUSTOM = `Custom (${MIN_CUSTOM_HOURS}+ hours)`;
const DURATIONS = [`Half day (${HALF_DAY_HOURS} hours)`, `Full day (${FULL_DAY_HOURS} hours)`, CUSTOM];

function Field({ id, label, required, children }: { id: string; label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
    </div>
  );
}

/** "2026-11-14" → "Sat, 14 Nov 2026", read as a local date so it never shifts by a day */
function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function sendInquiry(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const field = (name: string) => String(form.get(name) ?? "").trim();

  const inquiry = {
    name: field("name"),
    email: field("email"),
    date: field("date") && formatDate(field("date")),
    set: field("set"),
    duration: field("duration") === CUSTOM ? `Custom, ${field("hours")} hours` : field("duration"),
    crew: field("crew"),
    details: field("text"),
  };

  const lines = [
    `Hi Girgit Studios! I'm ${inquiry.name}.`,
    inquiry.email && `Email: ${inquiry.email}`,
    inquiry.date && `Shoot date: ${inquiry.date}`,
    inquiry.set && inquiry.set !== NOT_SURE && `Set: ${inquiry.set}`,
    inquiry.duration && inquiry.duration !== NOT_SURE && `Booking: ${inquiry.duration}`,
    inquiry.crew && `Crew size: ${inquiry.crew}`,
    inquiry.details,
  ];
  // Opened before anything else so the browser doesn't treat it as an unwanted pop-up
  window.open(whatsappLink(lines.filter(Boolean).join("\n")), "_blank", "noopener,noreferrer");

  // Also saved to the studio's lead sheet, when one is set up (see README). Bots fill the hidden field.
  if (!field("website")) {
    fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
      keepalive: true,
    }).catch(() => {});
  }
}

export function InquiryForm() {
  const dateRef = useRef<HTMLInputElement>(null);
  const [customHours, setCustomHours] = useState(false);

  // Past dates can't be picked. Set in the browser, as the build server's "today" goes stale.
  useEffect(() => {
    if (dateRef.current) dateRef.current.min = new Date().toLocaleDateString("en-CA");
  }, []);

  return (
    // Before JavaScript loads, the browser submits straight to WhatsApp; the details field is
    // named "text", which WhatsApp uses as the message. With JavaScript, all fields are sent.
    <form
      action={whatsappLink()}
      method="get"
      target="_blank"
      className="space-y-8"
      onSubmit={sendInquiry}
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Field id="inquiry-name" label="Name" required>
          <input
            id="inquiry-name"
            name="name"
            autoComplete="name"
            required
            placeholder="Your full name"
            className={`${FIELD_CLASS} h-12`}
          />
        </Field>
        <Field id="inquiry-email" label="Email address">
          <input
            id="inquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`${FIELD_CLASS} h-12`}
          />
        </Field>

        <Field id="inquiry-date" label="Shoot date">
          <input ref={dateRef} id="inquiry-date" name="date" type="date" className={`${FIELD_CLASS} h-12`} />
        </Field>
        <Field id="inquiry-duration" label="Booking">
          <div className="flex gap-3">
            <select
              id="inquiry-duration"
              name="duration"
              onChange={(event) => setCustomHours(event.target.value === CUSTOM)}
              className={`${FIELD_CLASS} h-12 min-w-0 flex-1`}
            >
              <option>{NOT_SURE}</option>
              {DURATIONS.map((duration) => (
                <option key={duration}>{duration}</option>
              ))}
            </select>
            {customHours && (
              <input
                name="hours"
                type="number"
                inputMode="numeric"
                min={MIN_CUSTOM_HOURS}
                max={24}
                required
                autoFocus
                aria-label={`Number of hours (at least ${MIN_CUSTOM_HOURS})`}
                placeholder="Hours"
                className={`${FIELD_CLASS} h-12 max-w-20 shrink-0 sm:max-w-28`}
              />
            )}
          </div>
        </Field>

        <Field id="inquiry-set" label="Set">
          <select id="inquiry-set" name="set" className={`${FIELD_CLASS} h-12`}>
            <option>{NOT_SURE}</option>
            <optgroup label="Single sets">
              {SETS.map((set) => (
                <option key={set.slug}>{set.name}</option>
              ))}
            </optgroup>
            <optgroup label="More ways to book">
              {STUDIO_PACKAGES.map((option) => (
                <option key={option.name}>{option.name}</option>
              ))}
            </optgroup>
          </select>
        </Field>
        <Field id="inquiry-crew" label="Crew size">
          <input
            id="inquiry-crew"
            name="crew"
            type="number"
            inputMode="numeric"
            min={1}
            max={99}
            placeholder="Including talent"
            className={`${FIELD_CLASS} h-12`}
          />
        </Field>
      </div>

      <Field id="inquiry-project" label="Shoot details">
        <textarea
          id="inquiry-project"
          name="text"
          rows={4}
          placeholder="What you're shooting, timings and anything else we should know"
          className={`${FIELD_CLASS} resize-y py-3`}
        />
      </Field>

      {/* Hidden from people; spam bots fill it in, and those inquiries aren't saved */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="flex flex-wrap items-center gap-x-8 gap-y-5 pt-2">
        <button
          type="submit"
          className="inline-flex h-12 items-center border border-transparent bg-foreground px-8 text-xs font-bold uppercase tracking-[0.16em] text-background transition-colors hover:border-foreground hover:bg-transparent hover:text-foreground"
        >
          Send inquiry on WhatsApp
        </button>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Or chat directly →
        </a>
      </div>
    </form>
  );
}
