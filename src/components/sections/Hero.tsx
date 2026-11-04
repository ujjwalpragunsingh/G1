"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { SETS } from "@/data/sets";
import { FULL_DAY_HOURS, HALF_DAY_HOURS, MIN_CUSTOM_HOURS, STUDIO_CONTACT } from "@/data/studio";

// The logo intro plays once per page load, not every time you navigate back home
let introPlayed = false;

const STATS = [
  { value: String(SETS.length), label: "Studio sets" },
  { value: `${HALF_DAY_HOURS} / ${FULL_DAY_HOURS}`, label: "Hour slots" },
  { value: `${MIN_CUSTOM_HOURS}+`, label: "Custom hours" },
];

const enterDelay = (seconds: number) => ({ "--enter-delay": `${seconds}s` }) as CSSProperties;

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  // Decided on first render, so hydration matches the server HTML
  const [showIntro] = useState(() => !introPlayed);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Visitors who prefer reduced motion keep the poster; the button can still start the reel
    if (!reduceMotion) videoRef.current?.play().catch(() => {});

    const intro = introRef.current;
    const navLogo = document.getElementById("navbar-logo");
    if (!showIntro || reduceMotion || !intro || !navLogo) return;
    introPlayed = true;

    // Fly the large logo from the middle of the screen into the navbar logo.
    // Timeline (ms after a 500 ms pause): fade in 0–500, fly 500–2000,
    // navbar logo appears at 1800, large logo fades out 1900–2100.
    const from = intro.getBoundingClientRect();
    const to = navLogo.getBoundingClientRect();
    const landed = `translate(${to.left + to.width / 2 - (from.left + from.width / 2)}px, ${
      to.top + to.height / 2 - (from.top + from.height / 2)
    }px) scale(${to.width / from.width})`;
    const timing = { id: "hero-intro", delay: 500, duration: 2100 };
    const easeInOut = "cubic-bezier(0.45, 0, 0.55, 1)";

    const animations = [
      intro.animate(
        [
          { opacity: 0, easing: easeInOut },
          { opacity: 1, offset: 500 / 2100 },
          { opacity: 1, offset: 1900 / 2100 },
          { opacity: 0 },
        ],
        timing
      ),
      intro.animate(
        [
          { transform: "none" },
          { transform: "none", offset: 500 / 2100, easing: easeInOut },
          { transform: landed, offset: 2000 / 2100 },
          { transform: landed },
        ],
        timing
      ),
      // Hide the navbar logo until the large one arrives
      navLogo.animate([{ opacity: 0 }, { opacity: 0 }], { id: "hero-intro", duration: 500 + 1800 }),
    ];

    return () => animations.forEach((animation) => animation.cancel());
  }, [showIntro]);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <section className="relative isolate flex min-h-svh overflow-hidden bg-[#08111a] text-white">
      <video
        ref={videoRef}
        poster="/videos/hero-poster.webp"
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      >
        {/* The vertical cut of the reel for portrait screens (phones), the wide cut for everything else */}
        <source src="/videos/hero-portrait.mp4" type="video/mp4" media="(orientation: portrait)" />
        <source src="/videos/hero-1080.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay keeps the white text readable on bright frames */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#08111a]/50" />

      {showIntro && (
        <div
          ref={introRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-1/2 top-1/2 z-50 size-28 -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-difference"
        >
          <Image src="/images/logos/logo-icon-white.png" alt="" fill sizes="112px" className="object-contain" />
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[1400px] flex-col justify-between gap-12 px-6 pb-8 pt-28 md:px-12 md:pb-12 md:pt-32">
        <div
          className="enter flex flex-wrap justify-between gap-x-6 gap-y-1 text-xs font-medium uppercase tracking-[0.18em] text-white/75"
          style={enterDelay(0.1)}
        >
          <span>Girgit Studios · {STUDIO_CONTACT.locality}</span>
          <span className="whitespace-nowrap">{STUDIO_CONTACT.coordinates}</span>
        </div>

        <div className="max-w-2xl">
          <h1
            className="enter text-[clamp(2.6rem,6.5vw,5.25rem)] font-bold uppercase leading-[0.94] tracking-[-0.03em]"
            style={enterDelay(0.2)}
          >
            <span className="block">Shaping</span>
            <span className="block bg-gradient-to-r from-white via-white/85 to-white/55 bg-clip-text text-transparent">
              Cinematic
            </span>
            <span className="block">Narratives.</span>
          </h1>
          <p className="enter mt-6 max-w-md text-base leading-relaxed text-white/80 md:text-lg" style={enterDelay(0.35)}>
            Creative production and sets designed for premium advertising campaigns.
          </p>
          <div className="enter mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" style={enterDelay(0.45)}>
            <a
              href="#showcase"
              className="inline-flex h-12 items-center border border-transparent bg-white px-8 text-xs font-bold uppercase tracking-[0.2em] text-[#08111a] transition-colors hover:border-white hover:bg-transparent hover:text-white"
            >
              Explore sets
            </a>
            <Link
              href="/our-story"
              className="text-xs font-bold uppercase tracking-[0.16em] text-white/80 transition-colors hover:text-white"
            >
              Our story →
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <dl className="enter grid grid-cols-3 gap-6 sm:gap-12" style={enterDelay(0.55)}>
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-1">
                <dt className="text-xs uppercase tracking-[0.12em] text-white/70">{stat.label}</dt>
                <dd className="text-2xl font-bold tracking-tight">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={toggleVideo}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-black/40 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
          >
            {playing ? <Pause aria-hidden="true" className="size-3.5" /> : <Play aria-hidden="true" className="size-3.5" />}
            {playing ? "Pause reel" : "Play reel"}
          </button>
        </div>
      </div>
    </section>
  );
}
