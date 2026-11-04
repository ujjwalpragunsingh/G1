import Image from "next/image";
import Link from "next/link";

// A server component, so the year is rendered once at build time and never
// mismatches between server and browser. It updates on the next deploy.
export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-3 md:flex-row md:gap-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logos/logo-icon-dark.png"
              alt=""
              width={1406}
              height={1364}
              className="size-10 dark:invert"
            />
            <span className="text-lg font-bold uppercase tracking-[0.08em] text-foreground">Girgit Studios</span>
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Architects of the frame
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Girgit Studios. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
