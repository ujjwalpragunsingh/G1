"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import { getSet } from "@/data/sets";
import { whatsappLink } from "@/data/studio";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const LEFT_LINKS = [
  { label: "Showcase", href: "/#showcase", id: "nav-showcase" },
  { label: "Services", href: "/#services", id: "nav-services" },
];

const RIGHT_LINKS = [
  { label: "Our Story", href: "/our-story", id: "nav-story" },
  { label: "Contact", href: "/#contact", id: "nav-contact" },
];

const MOBILE_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

const SUB_LINKS = [
  { label: "Overview", id: "sub-overview", href: "#overview" },
  { label: "Tech Specs", id: "sub-tech", href: "#tech-specs" },
  { label: "Booking", id: "sub-booking", href: "#booking" },
];

const LINK_CLASS =
  "relative px-5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-foreground/70 hover:text-foreground aria-[current=page]:text-foreground transition-colors duration-200";

export default function Navbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  // The menu belongs to the page it was opened on, so any navigation closes it
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);

  // Only a real set counts: /sets/unknown shows the 404 page, which is built with the home navbar
  const currentSet = pathname.startsWith("/sets/") ? getSet(pathname.split("/")[2] ?? "") : undefined;
  const isSetPage = Boolean(currentSet);
  const menuOpen = !isSetPage && menuOpenOn === pathname;

  const closeMenu = () => setMenuOpenOn(null);

  // Slide the hover highlight pill under the hovered link (animated by CSS transitions)
  useEffect(() => {
    const highlight = highlightRef.current;
    const container = containerRef.current;
    if (!highlight || !container) return;

    const target = hoveredLink ? document.getElementById(hoveredLink) : null;
    if (!target) {
      highlight.style.opacity = "0";
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    highlight.style.width = `${targetRect.width}px`;
    highlight.style.transform = `translateX(${targetRect.left - containerRect.left}px)`;
    highlight.style.opacity = "1";
  }, [hoveredLink]);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpenOn(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const bookingLink = whatsappLink(
    currentSet
      ? `Hi Girgit Studios! I am interested in booking "${currentSet.name}". Could you please check availability?`
      : undefined
  );

  return (
    <>
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none select-none">

        {/* ======================================================== */}
        {/* FLOATING PILL                                            */}
        {/* ======================================================== */}
        <div
          ref={containerRef}
          onMouseLeave={() => setHoveredLink(null)}
          className="pointer-events-auto relative flex items-center rounded-full bg-background/85 p-2 shadow-xl shadow-foreground/10 backdrop-blur-xl"
        >
          {/* Animated Hover Pill */}
          <div
            ref={highlightRef}
            className="absolute top-2 bottom-2 left-0 rounded-full bg-foreground/10 z-0 opacity-0 transition-[transform,width,opacity] duration-300 ease-out"
            style={{ width: "80px" }}
          />

          {/* ======================================================== */}
          {/* LEFT SIDE: Global Left Links OR Drill-down Back Arrow */}
          {/* ======================================================== */}
          <div className="flex items-center relative z-10 px-2 overflow-hidden">

            {/* Mobile: menu toggle in place of the link rows */}
            {!isSetPage && (
              <button
                type="button"
                onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/15 flex items-center justify-center text-foreground/70 transition-colors md:hidden"
              >
                {menuOpen ? (
                  <X aria-hidden="true" className="size-4" />
                ) : (
                  <Menu aria-hidden="true" className="size-4" />
                )}
              </button>
            )}

            {/* STATE A: Global Left Links (inert = skipped by keyboard and screen readers while hidden) */}
            <nav
              inert={isSetPage}
              className={`hidden md:flex items-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                !isSetPage
                  ? "max-w-[400px] opacity-100 pointer-events-auto"
                  : "max-w-0 opacity-0 pointer-events-none"
              }`}
            >
              {LEFT_LINKS.map((link) => (
                <Link
                  key={link.label}
                  id={link.id}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.id)}
                  className={LINK_CLASS}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* STATE B: Drill-down Back Arrow & Breadcrumb */}
            <div
              inert={!isSetPage}
              className={`flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isSetPage
                  ? "max-w-[300px] opacity-100 pointer-events-auto"
                  : "max-w-0 opacity-0 pointer-events-none"
              }`}
            >
              <Link
                href="/#showcase"
                aria-label="Back to all studio sets"
                className="w-8 h-8 shrink-0 rounded-full bg-foreground/5 hover:bg-foreground/15 flex items-center justify-center text-foreground/70 transition-colors"
                onMouseEnter={() => setHoveredLink(null)}
              >
                &larr;
              </Link>
              <span className="ml-3 hidden sm:inline text-xs uppercase font-bold tracking-[0.15em] text-foreground/80 pr-4">
                {currentSet?.name || "Details"}
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER: Permanent Global Logo Anchor                     */}
          {/* ======================================================== */}
          <Link
            href="/"
            aria-label="Girgit Studios home"
            className="relative flex items-center justify-center w-8 h-8 rounded-full bg-foreground mx-2 shrink-0 z-20"
            onClick={closeMenu}
            onMouseEnter={() => setHoveredLink(null)}
          >
            <div id="navbar-logo" className="relative w-5 h-5 mix-blend-difference">
              <Image
                src="/images/logos/logo-icon-white.png"
                alt=""
                fill
                sizes="20px"
                loading="eager"
                className="object-contain"
              />
            </div>
          </Link>

          {/* ======================================================== */}
          {/* RIGHT SIDE: Global Right Links OR Drill-down Sub-Nav     */}
          {/* ======================================================== */}
          {/* Empty on phones on the home page, so drop its padding to keep the pill symmetric */}
          <div className={`flex items-center relative z-10 px-2 overflow-hidden ${!isSetPage ? "max-md:px-0" : ""}`}>

            {/* STATE A: Global Right Links */}
            <nav
              inert={isSetPage}
              className={`hidden md:flex items-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                !isSetPage
                  ? "max-w-[400px] opacity-100 pointer-events-auto"
                  : "max-w-0 opacity-0 pointer-events-none"
              }`}
            >
              {RIGHT_LINKS.map((link) => (
                <Link
                  key={link.label}
                  id={link.id}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  onMouseEnter={() => setHoveredLink(link.id)}
                  className={LINK_CLASS}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* STATE B: Drill-down Sub Links & Book Now */}
            <div
              inert={!isSetPage}
              className={`flex items-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isSetPage
                  ? "max-w-[520px] opacity-100 pointer-events-auto pl-2"
                  : "max-w-0 opacity-0 pointer-events-none pl-0"
              }`}
            >
              {/* Sub links only fit beside the set name on wide screens */}
              <div className="hidden lg:flex items-center">
                {SUB_LINKS.map((sub) => (
                  <Link
                    key={sub.label}
                    id={sub.id}
                    href={sub.href}
                    onMouseEnter={() => setHoveredLink(sub.id)}
                    className={LINK_CLASS}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>

              <a
                href={bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="lg:ml-4 inline-flex h-9 shrink-0 items-center rounded-full bg-foreground px-4 text-xs font-bold uppercase tracking-[0.15em] text-background transition-colors duration-300 hover:bg-foreground/85 sm:px-6"
              >
                Book now
              </a>
            </div>
          </div>

          <div className="ml-2 flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MOBILE MENU: drops down below the pill                   */}
      {/* ======================================================== */}
      {menuOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-background/40 backdrop-blur-[2px] md:hidden"
          />
          <nav
            id="mobile-menu"
            aria-label="Main"
            className="menu-enter fixed left-4 right-4 top-[5.5rem] z-50 bg-background/95 p-3 shadow-xl shadow-foreground/10 backdrop-blur-xl md:hidden"
          >
            {MOBILE_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={closeMenu}
                className="flex min-h-12 items-center px-5 text-sm font-bold uppercase tracking-[0.14em] text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground aria-[current=page]:bg-foreground/5 aria-[current=page]:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </>
  );
}
