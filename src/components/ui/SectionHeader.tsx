import type { ReactNode } from "react";

// The one heading style every home-page section uses
export function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  /** Short intro shown beside the heading on wide screens */
  children?: ReactNode;
}) {
  return (
    <div className="reveal mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </span>
        <h2 className="text-3xl font-bold uppercase leading-[0.96] tracking-[-0.04em] text-foreground text-balance md:text-5xl">
          {title}
        </h2>
      </div>
      {children && (
        <p className="max-w-sm text-base leading-relaxed text-muted-foreground">{children}</p>
      )}
    </div>
  );
}
