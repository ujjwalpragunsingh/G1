export interface SetItem {
  id: string;
  /** Used in the page URL: /sets/{slug} */
  slug: string;
  name: string;
  code: string;
  category: string;
  description: string;
  /** Cover photo: the first gallery image */
  image: string;
  gallery: string[];
  useCases: string[];
  detailedSpecs: string[];
}

type SetData = Omit<SetItem, "code" | "image" | "gallery"> & {
  /** Number of photos in /public/images/sets/{slug}/ ({slug}-01.webp, {slug}-02.webp, ...) */
  photos: number;
  /** Photo number to show first; the rest keep their order */
  cover?: number;
};

function setGallery(slug: string, photos: number, cover = 1): string[] {
  const others = Array.from({ length: photos }, (_, index) => index + 1).filter((n) => n !== cover);
  return [cover, ...others].map(
    (n) => `/images/sets/${slug}/${slug}-${String(n).padStart(2, "0")}.webp`
  );
}

const SET_DATA: SetData[] = [
  {
    id: "1",
    slug: "girgit-wall",
    name: "Girgit Wall",
    category: "Cyclorama",
    description:
      "A versatile white cyclorama with RGB lighting for seamless colour and mood changes. Built for photo, video and fashion shoots.",
    photos: 7,
    cover: 7,
    useCases: ["Photo", "Video", "Fashion", "Product"],
    detailedSpecs: [
      "15 ft × 13 ft cyclorama",
      "11 ft ceiling height",
      "RGB lighting for colour and mood options",
      "Suitable for photography, video and fashion shoots",
    ],
  },
  {
    id: "2",
    slug: "meherabi-gali",
    name: "Meherabi Gali",
    category: "Indian Heritage",
    description:
      "A regal Indian-inspired set with an ornate traditional arch and rich earthy tones. Layered textures, vintage accents and warm lighting create a timeless cinematic mood.",
    photos: 6,
    useCases: ["Fashion", "Portrait", "Product", "Storytelling"],
    detailedSpecs: [
      "Traditional architectural arch",
      "Layered textures and vintage accents",
      "Warm lighting and rich earthy tones",
      "Designed for fashion, portrait, product and storytelling shoots",
    ],
  },
  {
    id: "3",
    slug: "clay-and-cane",
    name: "Clay & Cane",
    category: "Warm Contemporary",
    description:
      "A warm, contemporary set with intricate jaali textures and natural wood tones. Earthy materials, soft lighting and layered details create a refined, cosy atmosphere.",
    photos: 7,
    useCases: ["Interior", "Fashion", "Portrait", "Lifestyle"],
    detailedSpecs: [
      "Intricate jaali feature wall",
      "Natural wood and earthy materials",
      "Soft lighting with layered details",
      "Designed for interior, fashion, portrait and lifestyle shoots",
    ],
  },
  {
    id: "4",
    slug: "ivory-dusk",
    name: "Ivory Dusk",
    category: "Soft Minimal",
    description:
      "A warm, minimalist set in soft ivory tones with organic textures. Sculptural forms, textured walls and soft light create a calm, cinematic mood.",
    photos: 6,
    useCases: ["Fashion", "Portrait", "Product", "Lifestyle"],
    detailedSpecs: [
      "Soft ivory colour palette",
      "Organic textures and sculptural forms",
      "Soft, warm lighting",
      "Designed for fashion, portrait, product and lifestyle shoots",
    ],
  },
  {
    id: "5",
    slug: "patthar-ki-deewar",
    name: "Patthar Ki Deewar",
    category: "Textured Stone",
    description:
      "A rugged, stone-textured set with earthy tones and natural elements. Raw textures, warm daylight and organic shadows create a bold, timeless mood.",
    photos: 4,
    useCases: ["Portrait", "Fashion", "Product", "Commercial"],
    detailedSpecs: [
      "Rugged stone-textured wall",
      "Earthy tones and natural elements",
      "Warm daylight with organic shadows",
      "Designed for portrait, fashion, product and commercial shoots",
    ],
  },
  {
    id: "6",
    slug: "london-house",
    name: "London House",
    category: "Modern Classic",
    description:
      "A refined modern-classic set with elegant panelling and rich blue accents. Soft daylight, warm lighting and plush textures create a polished, premium feel.",
    photos: 5,
    useCases: ["Interior", "Fashion", "Portrait", "Lifestyle"],
    detailedSpecs: [
      "Elegant wall panelling",
      "Rich blue accents and plush textures",
      "Soft daylight with warm lighting",
      "Designed for interior, fashion, portrait and lifestyle shoots",
    ],
  },
  {
    id: "7",
    slug: "girgit-palette",
    name: "Girgit Palette",
    category: "Seamless Backdrops",
    description:
      "An automatic seamless backdrop system with 9 ft-wide backdrops. Choose maroon, beige or grey; other colour options can be arranged at an additional charge.",
    photos: 1,
    useCases: ["Fashion", "Portrait", "Product", "Commercial"],
    detailedSpecs: [
      "Automatic seamless backdrop system",
      "9 ft-wide backdrops",
      "Maroon, beige and grey available",
      "Other colour options are available at an additional charge",
    ],
  },
  {
    id: "8",
    slug: "green-wall",
    name: "Green Wall",
    category: "Movable Feature Wall",
    description:
      "A versatile green panelled wall with a seamless floor-to-wall finish. Mounted on wheels, it can be easily repositioned for different setups.",
    photos: 4,
    useCases: ["Fashion", "Portrait", "Product", "Creative"],
    detailedSpecs: [
      "Green panelled wall",
      "Seamless floor-to-wall finish",
      "Mounted on wheels for easy repositioning",
      "Designed for fashion, portrait, product and creative shoots",
    ],
  },
  {
    id: "9",
    slug: "black-wall",
    name: "Black Wall",
    category: "Classic Panelling",
    description:
      "A classic panelled wall with a bold black finish and refined moulding details. Rich texture, deep tones and clean lines create a dramatic, sophisticated backdrop.",
    photos: 4,
    useCases: ["Fashion", "Portrait", "Product", "Editorial"],
    detailedSpecs: [
      "Classic panelled wall",
      "Bold black finish with refined moulding",
      "Rich texture, deep tones and clean lines",
      "Designed for fashion, portrait, product and editorial shoots",
    ],
  },
];

export const SETS: SetItem[] = SET_DATA.map(({ photos, cover, ...set }) => {
  const gallery = setGallery(set.slug, photos, cover);
  return { ...set, code: `Set ${set.id.padStart(2, "0")}`, image: gallery[0], gallery };
});

export function getSet(slug: string) {
  return SETS.find((set) => set.slug === slug);
}
