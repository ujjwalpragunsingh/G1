export interface WorkCategory {
  name: string;
  /** Instagram post or reel links, or YouTube links. Up to 4 per category reads best. */
  links: string[];
}

// The "Selected work" row on the Our Story page: one tab per category, in this order.
// A pick of the portfolio sheet (CONTENT PORTFOLIO INSTAGRAM.xlsx); swap links in and out here.
// Reels with licensed music (e.g. a commercial song) don't play on other websites: Instagram shows
// "Watch on Instagram" instead. Pick reels with original audio.
export const WORK_CATEGORIES: WorkCategory[] = [
  {
    name: "Lifestyle",
    links: [
      "https://www.instagram.com/reel/DY7HfQiN9zO/",
      "https://www.instagram.com/reel/Dbii1qBqd1M/",
      "https://www.instagram.com/reel/DcQ1DeqK5cX/",
      "https://www.instagram.com/reel/DcvyzcIKRke/",
    ],
  },
  {
    // One each from Playboy Dehradun, Somo, Cafe Wink and Big Yellow Door 104
    name: "Food",
    links: [
      "https://www.instagram.com/reel/C7DsBf4v0Hu/",
      "https://www.instagram.com/reel/DRzZlg1EaIA/",
      "https://www.instagram.com/reel/DWtQ3aQE1d3/",
      "https://www.instagram.com/reel/C-sMfUHyPvM/",
    ],
  },
  {
    name: "Product",
    links: [
      "https://www.instagram.com/reel/DcLoaVou8Kc/",
      "https://www.instagram.com/reel/DcOJ92iOGrz/",
      "https://www.instagram.com/reel/DcGQHA0hyXk/",
    ],
  },
  {
    name: "UGC",
    links: [
      "https://www.instagram.com/reel/DFaeN6HMOVg/",
      "https://www.instagram.com/reel/DGVskvshxhW/",
      "https://www.instagram.com/reel/DIeL2lNBwg9/",
    ],
  },
  {
    name: "Event",
    links: ["https://www.instagram.com/reel/C6dC07XP5uY/", "https://www.instagram.com/reel/DYNIi1kPNTE/"],
  },
  {
    name: "Fashion",
    links: ["https://www.instagram.com/p/DUQHRGdDD00/"],
  },
  {
    name: "Behind the scenes",
    links: ["https://www.instagram.com/reel/DcbEkb8BXVH/"],
  },
  {
    name: "Podcast",
    links: [
      "https://youtu.be/Fpfk4hFIUWw",
      "https://youtu.be/Rz5QZTdDxkE",
      "https://youtu.be/ExvVSyptGcc",
      "https://youtu.be/oHBlJblrUT8",
    ],
  },
];

export type WorkEmbed = { kind: "instagram" | "youtube"; src: string };

/** The embeddable player for a work link, or null for links that can't be embedded (e.g. X posts). */
export function workEmbed(link: string): WorkEmbed | null {
  const instagram = link.match(/instagram\.com\/(p|reel|tv)\/([\w-]+)/);
  if (instagram) return { kind: "instagram", src: `https://www.instagram.com/${instagram[1]}/${instagram[2]}/embed/` };

  const youtube = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
  if (youtube) return { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${youtube[1]}` };

  return null;
}
