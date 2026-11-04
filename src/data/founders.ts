export interface Founder {
  /** Used in the page URL: /our-story#{slug} */
  slug: string;
  name: string;
  role: string;
  /**
   * Portrait photo (4:5), about 1600px tall, WebP, in /public/images/founders/.
   * Leave it out and their initials show instead.
   */
  photo?: string;
  /** One paragraph per entry */
  bio: string[];
  quote?: string;
  /** e.g. [{ label: "Instagram", href: "https://www.instagram.com/..." }] */
  links: { label: string; href: string }[];
}

// Shown side by side on the Our Story page (/our-story), in this order: the first on the left.
export const FOUNDERS: Founder[] = [
  {
    slug: "pragun-mittal",
    name: "Pragun Mittal",
    role: "Co-founder",
    photo: "/images/founders/pragun-mittal.webp",
    bio: [
      "Pragun Mittal has always seen a frame as more than a picture: it is a mood built from light, colour and space. Working behind the camera showed him how much a setting shapes a story, and how often creators have to settle for less. He co-founded Girgit Studios to change that, with sets designed so a shoot can begin the moment the crew walks in.",
      "For Pragun, every set at Girgit is a starting point rather than a backdrop: a space that changes its character from one shoot to the next, like the chameleon the studio is named after. He wants every brand, photographer and filmmaker who works here to leave with frames that feel entirely their own.",
    ],
    links: [],
  },
  {
    slug: "ujjwal-singh",
    name: "Ujjwal Singh",
    role: "Co-founder",
    photo: "/images/founders/ujjwal-singh.webp",
    bio: [
      "With a background in visual storytelling and a deep appreciation for design, Ujjwal founded Girgit Studios to redefine the way creative spaces and production come together. Driven by an eye for detail and a pursuit of thoughtful aesthetics, he envisions Girgit as a space where creative vision, design, and craftsmanship converge to create distinctive visual experiences.",
      "For Ujjwal, photography has always been about more than capturing what is seen; it is about finding beauty in details, spaces, and stories. Driven by a curiosity for design and a passion for visual storytelling, he founded Girgit Studios as an extension of his creative vision — a space where ideas take shape, experimentation is encouraged, and every project has room to become something unique.",
    ],
    links: [],
  },
];
