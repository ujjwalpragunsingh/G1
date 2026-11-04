import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center bg-background px-6 pb-20 pt-32 md:px-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Page not found</span>
        <h1 className="mt-4 text-4xl font-bold uppercase leading-[0.96] tracking-[-0.04em] text-foreground md:text-6xl">
          This frame doesn&apos;t exist.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
          The page may have moved. Have a look at the studio sets, or get in touch and we&apos;ll help you find the right one.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="/#showcase"
            className="inline-flex h-12 items-center bg-foreground px-8 text-xs font-bold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/85"
          >
            Browse the sets
          </Link>
          <Link
            href="/#contact"
            className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact the studio →
          </Link>
        </div>
      </div>
    </main>
  );
}
